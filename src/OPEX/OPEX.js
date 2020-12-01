import { PDFDownloadLink } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import HeaderBottom from '../Headers/HeaderBottom';
import HeaderFilter from '../Headers/HeaderFilter';
import HeaderTop from '../Headers/HeaderTop';
import { bankProxyUrl, proxyurl, proxyurl81 } from '../services/services';
import ActionResponse from '../UI/ActionResponse';
import Remove from '../UI/Remove';
import CsvModal from '../Utilities/CsvModal';
import PDFGenerator from './PDFGenerator/PDFGenerator';
import SOPEX from './SOPEX';
import classes from '../Headers/Header.module.css';
import utilitiesClasses from '../Utilities/Utilities.module.css';
import PdfDownloadModal from '../PdfDownloadModal';

const OPEX = () => {

    //http://cors-anywhere.herokuapp.com/
    const [action, setAction] = useState("Choose action");
    const [filteredOpex, setFilteredOpex] = useState([]);
    const [checkboxes, setCheckbox] = useState([]);
    const [paginationCount, setPaginationCount] = useState(1);
    const [advancedFilteredOpex, setAdvancedFilteredOpex] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [owners, setOwners] = useState([]);
    const [opex, setOpex] = useState([]);
    const [pdfInvoices, setPdfInvoices] = useState([]);
    const [managementCompany, setManagementCompany] = useState([]);
    const [filterValues, setFilterValues] = useState({
        number: "",
        owner_name: "",
        date_stamp: ""
    });
    const [operationSuccessful, setOperationSuccessful] = useState({
        success: '1',
        message: ''
    });
    const [isExport, setIsExport] = useState({
        data: [],
        headers: [],
        csvModal: false
    });

    const [isDeleting, setIsDeleting] = useState({
        delete1: false,
        deleteN: false
    });
    const [searchValue, setSearchValue] = useState("");
    const availableMonths = [
        { name: 'January' },
        { name: 'February' },
        { name: 'March' },
        { name: 'April' },
        { name: 'May' },
        { name: 'June' },
        { name: 'July' },
        { name: 'August' },
        { name: 'September' },
        { name: 'October' },
        { name: 'November' },
        { name: 'December' }
    ];
    const [pdfModal, setPdfModal] = useState();

    const [dataToFilter, setDataToFilter] = useState({
        chosenOwners: [],
        chosenApartments: [],
        //change to current month and date!
        chosenMonths: [],
        year: new Date().getFullYear()
    });
    const actions = ["Choose action", "Export chosen invoice", "Edit Offline", "Edit Facts", "Export PDF of the invoice", "Remove choosen invoice"];
    let downloadLink = "Export PDF of the invoice";


    useEffect(() => {

        fetchData();
    }, []);


    const fetchData = () => {
        let invoices = [];
        const apartmentsUrl = proxyurl + "apartments"; // site that doesn’t send Access-Control-*
        const personnelUrl = proxyurl + "personnels"; // site that doesn’t send Access-Control-*
        const opexUrl = proxyurl + "invoice/services"; // site that doesn’t send Access-Control-*
        fetch(opexUrl)
            .then(response => response.json())
            .then(invoicesRetreived => {
                invoices = invoicesRetreived;
            })
            .catch((err) => console.log(err))
            .finally(() => {
                if (invoices.length > 0) {
                    let apartmentsAndOwners = [];
                    let apartments = [];
                    fetch(apartmentsUrl)
                        .then(response => response.json())
                        .then(contents => {
                            if (contents.length) {
                                contents.forEach(el => {
                                    invoices.forEach(invEl => {
                                        if (el.apartment_id === invEl.apartment_id) {
                                            apartments.push(el);
                                        }
                                    })
                                });
                                let allPersonnels = [];
                                setApartments(apartments);
                                fetch(personnelUrl)
                                    .then(response => response.json())
                                    .then(personnels => {
                                        allPersonnels = personnels;
                                        if (personnels.length) {
                                            let activeOwners = [];
                                            personnels.forEach((elPe) => {
                                                apartments.forEach(elAp => {
                                                    if (elPe.personnel_id === elAp.owner_id && activeOwners.findIndex(acO => acO.personnel_id === elPe.personnel_id) < 0) {
                                                        activeOwners.push(elPe);
                                                    }
                                                })
                                            })
                                            setOwners(activeOwners);
                                            apartmentsAndOwners = setApartmentAndOwners([...apartments], [...personnels]);
                                        }
                                    })
                                    .catch(() => console.log("Can’t access " + personnelUrl + " response. Blocked by browser?"))
                                    .finally(() => {
                                        if (allPersonnels.length)
                                            fetch(proxyurl + 'managementCompanies')
                                                .then(response => response.json())
                                                .then(company => {
                                                    let currentDate = new Date();
                                                    let month = currentDate.getMonth() + 1;
                                                    let year = currentDate.getFullYear();
                                                    if (currentDate.getDate() < 25) {
                                                        month--;
                                                    }
                                                    fetch(bankProxyUrl + `?fdate=25.${month}.${year}`)
                                                        .then(respo => respo.text())
                                                        .then(text => new window.DOMParser().parseFromString(text, "text/xml"))
                                                        .then(data1 => {
                                                            const items = data1.querySelectorAll("item");
                                                            items.forEach(el => {
                                                                if (el.querySelector("title").innerHTML === "USD") {
                                                                    company[0].ex_rate = el.querySelector("description").innerHTML;
                                                                }
                                                            });
                                                        });
                                                    setManagementCompany(company);
                                                })
                                                .catch(er => console.log(er))
                                                .finally(() => {
                                                    setApartmentsOwnersOpex(invoices, apartmentsAndOwners);
                                                });
                                    });
                            }
                        })
                        .catch((err) => console.log("Can’t access " + apartmentsUrl + " response. Blocked by browser?", err));
                }
                return invoices;
            });
    }

    const setApartmentsOwnersOpex = (invoices, apartmentsAndOwners) => {
        invoices.forEach((el, index) => {
            apartmentsAndOwners.forEach(apOw => {
                if (el.apartment_id === apOw.apartment_id) {
                    el.total_payments = el.payment_online + el.payment_offline + el.payment_user_balance;
                    el.positive_balance = el.amount - el.total_payments < 0 ? el.total_payments - el.amount : 0;
                    el.negative_balance = el.amount - el.total_payments > 0 ? el.total_payments - el.amount : 0;
                    el.total_savings = el.real_amount ? el.total_payments - el.real_amount : 0;
                    invoices[index] = {
                        ...invoices[index],
                        ...apOw
                    };
                }
            })
        });
        let filteredData = getFilteredData(invoices);
        setOpex([...filteredData]);
        setFilteredOpex([...filteredData]);
        setAdvancedFilteredOpex([...filteredData]);
    }

    const pdfLinkGenerator = (invoices) => {
        return (<PDFDownloadLink id="we" key={Math.random()}
            document={<PDFGenerator invoices={invoices} />}
            fileName="invoice.pdf"
            style={{
                textDecoration: "none",
                padding: "10px",
                color: "#4a4a4a",
                backgroundColor: "#f2f2f2",
                border: "1px solid #4a4a4a"
            }}
        >
            {({ blob, url, loading, error }) => {
                downloadLink = url;
                return loading ? "Loading invoice..." : "Export PDF of the invoice"
            }
            }
        </PDFDownloadLink>);
    }


    const setApartmentAndOwners = (apartments, personnels) => {
        apartments.forEach(apartment => {
            personnels.forEach(personnel => {
                if (apartment.owner_id === personnel.personnel_id) {
                    apartment["owner_name"] = personnel.name;
                }
            })
        });
        return apartments;
    }


    const filterData = (e, searchItem) => {
        setSearchValue(e.target.value);
        let newFilterValues = { ...filterValues };
        if (searchItem === "apartment")
            searchItem = "number"
        newFilterValues[searchItem] = e.target.value;
        let newItems = getFilteredOpex(opex, newFilterValues.number.split(" "), "number");
        newItems = getFilteredOpex(newItems, newFilterValues.date_stamp.split(" "), "date_stamp");
        newItems = getFilteredOpex(newItems, newFilterValues.owner_name.split(" "), "owner_name");
        let newCheckboxState = [];
        newItems.forEach(opexEl => {
            let checkIndex = checkboxes.findIndex(checkbox => checkbox === opexEl.invoice_id.toString());
            if (checkIndex > -1)
                newCheckboxState.push(opexEl.invoice_id.toString())
        });
        setFilterValues(newFilterValues);
        setCheckbox(newCheckboxState);
        setFilteredOpex(newItems);
    };

    const getFilteredOpex = (opex, text, searchItem) => {
        return opex.filter(function (item) {
            return text.every(function (el) {
                if (searchItem === "date_stamp") {
                    return new Date(item.date_stamp).getFullYear().toString().indexOf(el) > -1
                } else if (searchItem) {
                    return item[searchItem].indexOf(el) > -1;
                } else {
                    return item.number.indexOf(el) > -1
                }
                // return item.owner_name.indexOf(el) > -1 ||
                //     item.number.indexOf(el) > -1 ||
                //     item.amount.toString().indexOf(el) > -1 ||
                //     // item.online.toString().indexOf(el) > -1 ||
                //     // item.offline.toString().indexOf(el) > -1 ||
                //     // item.used_balance.toString().indexOf(el) > -1 ||
                //     // item.used_savings.toString().indexOf(el) > -1 ||
                //     // item.positive_balance.toString().indexOf(el) > -1 ||
                //     // item.negative_balance.toString().indexOf(el) > -1 ||
                //     // item.total_savings.toString().indexOf(el) > -1 ||
                //     item.real_amount.toString().indexOf(el) > -1
            });
        });
    }

    const onChangeAction = (event) => {

        if (action !== event.target.value) {
            switch (event.target.value) {
                case 'Choose action':
                    setAction(event.target.value);
                    break;
                case 'Export chosen invoice':
                    if (checkboxes.length > 0) {
                        let headers = [
                            { label: 'Owner', key: 'owner_name' },
                            { label: 'Apartment', key: 'number' },
                            { label: 'Month', key: 'date_stamp' },
                            { label: 'Invoice', key: 'amount' },
                            { label: 'Online', key: 'payment_online' },
                            { label: 'Offline', key: 'payment_offline' },
                            // { label: 'Used savings', key: 'used_savings' },
                            { label: 'Used balance', key: 'payment_user_balance' },
                            { label: 'Total payments', key: 'total_payments' },
                            { label: 'Negative balance', key: 'negative_balance' },
                            { label: 'Positive balance', key: 'positive_balance' },
                            { label: 'Facts', key: 'real_amount' },
                            { label: 'Total savings', key: 'total_savings' }
                        ];
                        let data = [];
                        checkboxes.forEach((invoice_id) => {
                            filteredOpex.forEach((sopex) => {
                                if (sopex.invoice_id === +invoice_id) {
                                    sopex.total_savings = sopex.total_payments - sopex.real_amount;
                                    data.push(sopex);
                                }
                            })
                        })

                        setIsExport({ data: data, headers: headers, csvModal: true });
                    }
                    break;
                case 'Export PDF of the invoice':
                    if (checkboxes.length > 0) {
                        let allCheckboxes = [...checkboxes];
                        let invoices = [];
                        invoices = filteredOpex.filter(el => {
                            let contains = allCheckboxes.includes(el.invoice_id.toString());
                            if (contains) {
                                el.company_iik = managementCompany[0].iik;
                                el.company_rnn = managementCompany[0].rnn;
                                el.company_bin = managementCompany[0].bin;
                                el.company_bik = managementCompany[0].bik;
                                el.bank_name = managementCompany[0].bank_name;
                                el.company_address = managementCompany[0].address;
                                el.company_name = managementCompany[0].name;
                                el.company_phone = managementCompany[0].phone_number;
                                el.ex_rate = managementCompany[0].ex_rate;
                            }
                            return contains;
                        });
                        setPdfInvoices(invoices);
                        setPdfModal(true);
                    }
                    // window.open(downloadLink, "_blank")
                    break;
                case 'Remove choosen invoice':
                    if (checkboxes.length > 0) {
                        showDelete();
                    }
                    break;
                case "Edit Offline":
                    if (checkboxes.length === 1) {
                        let invoices = [];
                        let allCheckboxes = [...checkboxes];
                        invoices = filteredOpex.filter(el => {
                            let contains = allCheckboxes.includes(el.invoice_id.toString());
                            if (contains) {
                                el.company_iik = managementCompany[0].iik;
                                el.company_rnn = managementCompany[0].rnn;
                                el.company_bin = managementCompany[0].bin;
                                el.company_bik = managementCompany[0].bik;
                                el.bank_name = managementCompany[0].bank_name;
                                el.company_address = managementCompany[0].address;
                                el.company_name = managementCompany[0].name;
                                el.company_phone = managementCompany[0].phone_number;
                                el.ex_rate = managementCompany[0].ex_rate;
                            }
                            return contains;
                        });
                        makeEditableOffline(invoices[0].invoice_id);
                    }
                    break;
                case "Edit Facts":
                    if (checkboxes.length === 1) {
                        let invoices = [];
                        let allCheckboxes = [...checkboxes];
                        invoices = filteredOpex.filter(el => {
                            let contains = allCheckboxes.includes(el.invoice_id.toString());
                            if (contains) {
                                el.company_iik = managementCompany[0].iik;
                                el.company_rnn = managementCompany[0].rnn;
                                el.company_bin = managementCompany[0].bin;
                                el.company_bik = managementCompany[0].bik;
                                el.bank_name = managementCompany[0].bank_name;
                                el.company_address = managementCompany[0].address;
                                el.company_name = managementCompany[0].name;
                                el.company_phone = managementCompany[0].phone_number;
                                el.ex_rate = managementCompany[0].ex_rate;
                            }
                            return contains;
                        });
                        makeEditableFacts(invoices[0].invoice_id);
                    }
                    break;
            }
            setAction("Choose action");
        }
    };


    const removeSelectedOpex = () => {
        const deleteUrl = proxyurl + "invoice/utilities?id=";
        let allCheckboxes = [...checkboxes];
        let opexToDelete = [...checkboxes];
        let allSucceed = true;
        let counter = 0;
        allCheckboxes.forEach((id, checkindex) => {
            fetch(deleteUrl + id, {
                method: "DELETE"
            })
                .then(response => {
                    counter++;
                    if (response.ok) {
                        console.log("Succesfully deleted!");
                    } else {
                        allSucceed = false;
                        let itemIndex = opexToDelete.findIndex(el => el === id);
                        opexToDelete.splice(itemIndex, 1);
                        console.log("Try again!");
                    }
                })
                .catch(() => {
                    allSucceed = false;
                    let itemIndex = opexToDelete.findIndex(el => el === id);
                    opexToDelete.splice(itemIndex, 1);
                    console.log("Can’t access " + deleteUrl + " response. Blocked by browser?")
                })
                .finally(() => {
                    let checkboxesToSet = [...allCheckboxes];
                    if (counter === allCheckboxes.length) {
                        if (allSucceed) {
                            setOperationSuccessful({
                                success: '2',
                                message: "Invoices deleted successfully!"
                            });
                        } else {
                            setOperationSuccessful({
                                success: '3',
                                message: "Selected invoices could not be deleted!"
                            });
                        }
                        setTimeout(() => {
                            setOperationSuccessful({
                                success: '1',
                                message: ""
                            });
                        }, 4000);
                        cancelDelete();
                        let allOpex = [...filteredOpex];
                        let index = -1;

                        allOpex.forEach((el, apartIndex) => {
                            allOpex[apartIndex] = { ...el };
                        });


                        for (let v = 0; v < opexToDelete.length; v++) {

                            index = allOpex.findIndex(el => {
                                return el["invoice_id"] === +opexToDelete[v]
                            });
                            if (index == -1)
                                continue;
                            allOpex.splice(index, 1);
                            checkboxesToSet.splice(v, 1);
                        };

                        setFilteredOpex(allOpex);
                        setAdvancedFilteredOpex(allOpex);
                        setOpex(allOpex);
                        setCheckbox(checkboxesToSet);
                    }
                    setAction("Choose action");
                });
        });

    }

    const saveEdit = (sopex) => {

        let allOpex = [...advancedFilteredOpex];

        let index = -1;

        allOpex.forEach((el, id) => {
            allOpex[id] = { ...el };
            if (el["invoice_id"] === sopex.invoice_id) {
                index = id;
            }
        });
        allOpex[index].total_payments = allOpex[index].payment_online + sopex.offline_pay + allOpex[index].payment_user_balance;
        allOpex[index].positive_balance = allOpex[index].amount - allOpex[index].total_payments < 0 ? allOpex[index].total_payments - allOpex[index].amount : 0;
        allOpex[index].negative_balance = allOpex[index].amount - allOpex[index].total_payments > 0 ? allOpex[index].total_payments - allOpex[index].amount : 0;
        if (sopex.real_amount) {
            allOpex[index].total_savings = sopex.real_amount ? allOpex[index].total_payments - sopex.real_amount : 0;
        } else {
            allOpex[index].total_savings = allOpex[index].real_amount ? allOpex[index].total_payments - allOpex[index].real_amount : 0;
        }
        Object.assign(allOpex[index], sopex, { isEditableFacts: false, isEditableOffline: false }, { payment_offline: sopex.offline_pay });
        let text = searchValue.split(' ');
        let newItems = getFilteredOpex(allOpex, text);
        setFilteredOpex(newItems);
        setAdvancedFilteredOpex(allOpex);
    }


    const saveSOpex = (postData, method = "POST") => {
        if (method === "POST") {
            delete postData.opex_invoice_id;
        }
        let postPersonnelUrl = proxyurl + `invoice/services?id=${postData.invoice_id}&realAmount=${postData.real_amount}`;

        let postOfflineUrl = proxyurl81 + "payment/invoice/service";
        if (postData.offline_edit) {
            delete postData.offline_edit;
            fetch(postOfflineUrl, {
                method: "POST",
                body: JSON.stringify(postData)
            }).then(res => {
                saveEdit(postData);
                setOperationSuccessful({
                    success: '2',
                    message: "Offline edited successfully!"
                });
            }).catch((error) => {
                setOperationSuccessful({
                    success: '3',
                    message: "Offline could not be created or edited!"
                });
                console.error('Error:', error);
            }).finally(() => {
                setTimeout(() => {
                    setOperationSuccessful({
                        success: '1',
                        message: ""
                    });
                }, 4000);
            });

        } else {
            fetch(postPersonnelUrl, {
                method: method,
                body: JSON.stringify(postData)
            }).then((res) => {
                if (res.status === 200) {
                    if (method === "PUT") {
                        setOperationSuccessful({
                            success: '2',
                            message: "Facts edited successfully!"
                        });
                        saveEdit(postData);
                    }
                    else {
                        setOperationSuccessful({
                            success: '2',
                            message: "Facts created successfully!"
                        });
                        fetchData();
                        //setIsCreate(false);
                    }
                }
                else {
                    setOperationSuccessful({
                        success: '3',
                        message: "Facts could not be created or edited!"
                    });
                }
            })
                .catch((error) => {
                    setOperationSuccessful({
                        success: '3',
                        message: "Facts could not be created or edited!"
                    });
                    console.error('Error:', error);
                }).finally(() => {
                    setTimeout(() => {
                        setOperationSuccessful({
                            success: '1',
                            message: ""
                        });
                    }, 4000);
                });
        }


    }


    const onCheckboxClick = (e) => {
        if (e.target.checked) {
            let newCheckboxState = [];
            let invoices = [];
            if (e.target.name === "all") {
                filteredOpex.forEach(opexEl => {
                    newCheckboxState.push(opexEl.invoice_id.toString())
                });
            }
            else {
                newCheckboxState = [...checkboxes, e.target.name];
            }

            invoices = filteredOpex.filter(el => {
                let contains = newCheckboxState.includes(el.invoice_id.toString());
                if (contains) {
                    el.company_iik = managementCompany[0].iik;
                    el.company_rnn = managementCompany[0].rnn;
                    el.company_bin = managementCompany[0].bin;
                    el.company_bik = managementCompany[0].bik;
                    el.bank_name = managementCompany[0].bank_name;
                    el.company_address = managementCompany[0].address;
                    el.company_name = managementCompany[0].name;
                    el.company_phone = managementCompany[0].phone_number;
                    el.ex_rate = managementCompany[0].ex_rate;
                }
                return contains;
            }
            );

            //setPdfInvoices(invoices);
            setCheckbox(newCheckboxState);
        } else {
            let allCheckboxes = [...checkboxes];
            let allInvoices = [...pdfInvoices];
            if (e.target.name === "all") {
                allCheckboxes = [];
                allInvoices = [];
            } else {
                let removeAtIndex = allCheckboxes.findIndex(el => el === e.target.name);
                allCheckboxes.splice(removeAtIndex, 1);
                let invoiceToDeleteIndex = allInvoices.findIndex(el => el.invoice_id === +e.target.name);
                allInvoices.splice(invoiceToDeleteIndex, 1);
            }
            //setPdfInvoices(allInvoices);
            setCheckbox(allCheckboxes);
        }
    }


    const removeSOpex = (id) => {
        let success = false;
        const deleteUrl = proxyurl + "invoice/utilities?id=";
        fetch(deleteUrl + id, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    cancelDelete();
                    success = true;
                    console.log("Succesfully deleted!");
                } else {
                    console.log("Try again!");
                }
            })
            .catch(() => {
                console.log("Can’t access " + deleteUrl + " response. Blocked by browser?")
            })
            .finally(() => {
                setTimeout(() => {
                    setOperationSuccessful({
                        success: '1',
                        message: ""
                    });
                }, 4000);
                if (success) {
                    setOperationSuccessful({
                        success: '2',
                        message: "Invoice deleted successfully!"
                    });
                    let allOpex = [...filteredOpex];
                    let index = -1;
                    allOpex.forEach((el, apartIndex) => {
                        allOpex[apartIndex] = { ...el };
                    });

                    index = allOpex.findIndex(el =>
                        el["invoice_id"] === id
                    );

                    allOpex.splice(index, 1);
                    setFilteredOpex(allOpex);
                    setAdvancedFilteredOpex(allOpex);
                    setOpex(allOpex);
                    setCheckbox([]);
                }
                else {
                    setOperationSuccessful({
                        success: '3',
                        message: "Invoice could not be deleted!"
                    });
                }
                setAction("Choose action");

            });
    }



    const makeEditableOffline = (id) => {
        let allOpex = [...filteredOpex];

        allOpex.forEach((el, index) => {

            allOpex[index] = { ...el };
            if (+id === +el.invoice_id) {
                allOpex[index].isEditableOffline = true;
                allOpex[index].isEditableFacts = false;
            }

        });

        setFilteredOpex(allOpex);
    }

    const makeEditableFacts = (id) => {
        let allOpex = [...filteredOpex];

        allOpex.forEach((el, index) => {

            allOpex[index] = { ...el };
            if (+id === +el.invoice_id) {
                allOpex[index].isEditableFacts = true;
                allOpex[index].isEditableOffline = false;
            }

        });

        setFilteredOpex(allOpex);
    }

    const loadMore = (count) => {
        setPaginationCount(paginationCount + count);
    }


    // See more button
    let buttonType = null;
    if (filteredOpex.length > 7 * paginationCount) {
        buttonType = <button className={classes.filterButton} style={{ width: "10% !important" }} onClick={() => loadMore(+1)} > Load More </button>;
    }

    const cancelUpload = () => {
        // setIsUpload(false);
        setAction("Choose action");
    }

    const cancelEdit = (id) => {
        let allOpex = [...filteredOpex];

        allOpex.forEach((el, index) => {
            allOpex[index] = { ...el };
            if (el.invoice_id === id) {
                allOpex[index].isEditableFacts = false;
                allOpex[index].isEditableOffline = false;
            }
        });

        setFilteredOpex(allOpex);
        setAction("Choose action");
    }


    const advancedFilter = (selectedValue, key, remove) => {
        switch (key) {
            case "Apartments":
                let newChosenApartments = [...dataToFilter.chosenApartments];
                if (remove) {
                    let indexRemove = dataToFilter.chosenApartments.findIndex(el => el.number === selectedValue.number);
                    newChosenApartments.splice(indexRemove, 1);
                }
                else {
                    newChosenApartments = newChosenApartments.concat({ number: selectedValue.number });
                }
                setDataToFilter({
                    ...dataToFilter,
                    chosenApartments: newChosenApartments
                })
                break;
            case "Owners":
                let newChosenOwner = [...dataToFilter.chosenOwners];
                if (remove) {
                    let indexRemove = dataToFilter.chosenOwners.findIndex(el => el.name === selectedValue.name);
                    newChosenOwner.splice(indexRemove, 1);
                }
                else {
                    newChosenOwner = newChosenOwner.concat({ name: selectedValue.name });
                }
                setDataToFilter({
                    ...dataToFilter,
                    chosenOwners: newChosenOwner
                })
                break;
            case "Month":
                // setDataToFilter({
                //     ...dataToFilter,
                //     month: getMonthFromString(selectedValue)
                // })
                let newChosenMonth = [...dataToFilter.chosenMonths];
                if (remove) {
                    let indexRemove = dataToFilter.chosenMonths.findIndex(el => el.name === selectedValue.name);
                    newChosenMonth.splice(indexRemove, 1);
                }
                else {
                    newChosenMonth = newChosenMonth.concat({ name: selectedValue.name });
                }
                setDataToFilter({
                    ...dataToFilter,
                    chosenMonths: newChosenMonth
                });
                break;
            case "Year":
                setDataToFilter({
                    ...dataToFilter,
                    year: selectedValue.target.value
                })
                break;
        };

    };

    const setAdvancedFilterOpex = (reset) => {

        if (reset) {
            let text = searchValue.split(' ');
            let newItems = getFilteredOpex([...opex], text);
            setFilteredOpex(newItems);
            setAdvancedFilteredOpex(newItems);
            setDataToFilter({
                chosenOwners: [],
                chosenApartments: [],
                //change to current month and date!
                chosenMonths: [],
                year: new Date().getFullYear()
            });

        }
        else {
            let sopexData = [...opex];
            let newItems = [];
            let filteredData = [];
            if (sopexData.length > 0) {
                filteredData = getFilteredData(sopexData);
                let text = searchValue.split(' ');
                newItems = getFilteredOpex(filteredData, text);
            }
            setAdvancedFilteredOpex(newItems);
            setFilteredOpex(newItems);
            // setOpex([...sopexData]);

        }
    }

    const getFilteredData = (sopexData) => {
        return sopexData.filter(el => {
            return (dataToFilter.chosenApartments.findIndex(elApart => (elApart.number) === el.apartment) > -1 || dataToFilter.chosenApartments.length === 0) &&
                (dataToFilter.chosenMonths.findIndex(elmonth => getMonthFromString(elmonth.name) === new Date(el.date_stamp).getMonth() + 1) > -1 || !dataToFilter.month) &&
                (new Date(el.date_stamp).getFullYear() == dataToFilter.year || !dataToFilter.year) &&
                (dataToFilter.chosenOwners.findIndex(val => val.name === el.owner_name) > -1 || dataToFilter.chosenOwners.length == 0)
        });
    }



    function getMonthFromString(month) {
        return new Date(Date.parse(month + " 1, 2012")).getMonth() + 1
    }
    const cancelDelete = () => {
        setIsDeleting({
            delete1: '',
            deleteN: ''
        });
    }

    const showDelete = (id) => {
        let delVal = id ? { delete1: id, deleteN: '' } : { deleteN: 'a', delete1: '' }
        setIsDeleting(delVal);
    };

    const removeCsvModal = () => {
        setIsExport({
            ...isExport,
            csvModal: false
        })
    }
    const removePdfModal = () => {
        setPdfModal(false);
    }


    return (
        <>
            {operationSuccessful.success === '3' &&
                <ActionResponse text={operationSuccessful.message} class="btn-danger" />
            }
            {operationSuccessful.success === '2' &&
                <ActionResponse text={operationSuccessful.message} class="btn-success" />
            }
            {isExport.csvModal &&
                <CsvModal isExport={isExport} removeCsvModal={removeCsvModal} />
            }

            {isDeleting.delete1 &&
                <Remove
                    cancelDelete={cancelDelete}
                    removeItem={removeSOpex}
                    id={isDeleting.delete1}
                    name="invoice" />
            }

            {isDeleting.deleteN &&
                <Remove
                    cancelDelete={cancelDelete}
                    removeItem={removeSelectedOpex}
                    name="invoices" />
            }

            {pdfModal &&
                <div >
                    <PdfDownloadModal invoices={pdfInvoices} removeModal={removePdfModal} isOpex />
                    {/* {pdfLinkGenerator(pdfInvoices)}; */}
                </div>
            }

            <HeaderTop menuType="OPEX" />
            {/* <HeaderFilter
                owners={[...owners]}
                apartments={[...apartments]}
                advancedFilter={advancedFilter}
                availableMonths={availableMonths}
                dataToFilter={dataToFilter}
                setAdvancedFilterUtilities={setAdvancedFilterOpex} /> */}

            <HeaderBottom
                action={action}
                totalNumber={filteredOpex.length}
                items={actions}
                filterData={filterData}
                choosen={checkboxes.length}
                onChange={onChangeAction}
                type />

            {/* <div hidden>
                {pdfLinkGenerator(pdfInvoices)};
          </div> */}

            <div className="App">
                <header className="App-header">
                </header>
                <main>
                    <table className={utilitiesClasses.MainTable} >
                        <thead >
                            <tr >
                                <th style={{ float: 'left' }}>
                                    <input
                                        type="checkbox"
                                        name="all"
                                        onChange={onCheckboxClick} /></th>
                                <th style={{ minWidth: '50px' }}>Owner</th>
                                <th style={{ minWidth: '71px' }}>Apt.</th>
                                <th style={{ minWidth: '66px' }}>Month</th>
                                <th style={{ minWidth: '57px' }}>Invoice</th>
                                <th style={{ minWidth: '57px' }}>Online</th>
                                <th style={{ minWidth: '57px' }}>Offline</th>
                                {/* <th style={{ minWidth: '57px' }}>Used savings</th> */}
                                <th style={{ minWidth: '57px' }}>Used balance</th>
                                <th style={{ minWidth: '57px' }}>Total payments</th>
                                <th style={{ minWidth: '57px' }}>Balance (-)</th>
                                <th style={{ minWidth: '57px' }}>Balance (+)</th>
                                <th style={{ minWidth: '57px' }}>Facts</th>
                                <th style={{ minWidth: '57px' }}>Total savings</th>
                                <th style={{ minWidth: '73px' }}></th>
                                <th style={{ minWidth: '57px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOpex.slice(0, 7 * paginationCount).map(el => {

                                return <SOPEX
                                    checked={checkboxes.findIndex(chel => +chel === el.invoice_id) > -1}
                                    key={el.invoice_id}
                                    sopex={{ ...el }}
                                    edit={el.isEditable}
                                    onCancel={cancelEdit}
                                    checkboxClicked={onCheckboxClick}
                                    showDialog={showDelete}
                                    makeEditable={makeEditableFacts}
                                    saveEdit={saveSOpex} />
                            })
                            }
                            <tr>
                                <td></td>
                                <td>Total</td>
                                <td></td>
                                <td></td>
                                <td>{filteredOpex.slice(0, 7 * paginationCount).reduce((sum, el2) => sum + el2.amount, 0).toFixed(2)}</td>
                                <td></td>
                                <td></td>
                                {/* <td>...</td> */}
                                <td></td>
                                <td></td>
                                <td>{filteredOpex.slice(0, 7 * paginationCount).reduce((sum, el2) => sum + el2.negative_balance, 0).toFixed(2)}</td>
                                <td></td>
                                <td>{filteredOpex.slice(0, 7 * paginationCount).reduce((sum, el2) => sum + el2.real_amount, 0).toFixed(2)}</td>
                                <td>{filteredOpex.slice(0, 7 * paginationCount).reduce((sum, el2) => sum + el2.total_savings, 0).toFixed(2)}</td>
                                <td></td>
                                <td></td>
                            </tr>

                        </tbody>
                    </table>
                    <div style={{ textAlign: 'left', width: "10%" }}>
                        {buttonType}
                    </div>
                </main>
            </div>
        </>
    );
}

export default OPEX;