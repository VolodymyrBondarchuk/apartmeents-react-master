import React, { useState, useEffect, useRef } from 'react';
import { proxyurl, proxyurl81 } from '../services/services';
import Utility from './Utility';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFGeneratorUtilities from './PDFGenerator/PDFGeneratorUtilities';
import HeaderTop from '../Headers/HeaderTop';
import HeaderBottom from '../Headers/HeaderBottom';
import HeaderFilter from '../Headers/HeaderFilter';
import Remove from '../UI/Remove';
import CsvModal from './CsvModal';
import * as XLSX from 'xlsx';
import ChooseFile from './ChooseFile';
import ActionResponse from '../UI/ActionResponse';
import headerclasses from '../Headers/Header.module.css';
import utilitiesClasses from './Utilities.module.css';
import PdfDownloadModal from '../PdfDownloadModal';

const Utilities = (props) => {
    //http://cors-anywhere.herokuapp.com/
    const [action, setAction] = useState("Choose action");
    const [filteredUtilities, setFilteredUtilities] = useState([]);
    const [checkboxes, setCheckbox] = useState([]);
    const [paginationCount, setPaginationCount] = useState(1);
    const [utilities, setUtilities] = useState([]);
    const [advancedFilteredUtilities, setAdvancedFilteredUtilities] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [owners, setOwners] = useState([]);
    const [pdfInvoices, setPdfInvoices] = useState([]);
    const [managementCompany, setManagementCompany] = useState([]);
    const fileRef = useRef(null);
    const [filterValues, setFilterValues] = useState({
        apartment: "",
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
    const [isUpload, setIsUpload] = useState(false);

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
    const actions = ["Choose action", "Export chosen invoice", "Edit Offline", "Upload table of the new invoices", "Export PDF of the invoice", "Remove choosen utilities"];
    let downloadLink = "Export PDF of the invoice";


    useEffect(() => {

        fetchData();
    }, []);

    const pdfLinkGenerator = (invoices) => {
        return (<PDFDownloadLink id="we" key={Math.random()}
            document={<PDFGeneratorUtilities invoices={invoices} />}
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

    const fetchData = () => {
        let invoices = [];
        const apartmentsUrl = proxyurl + "apartments"; // site that doesn’t send Access-Control-*
        const personnelUrl = proxyurl + "personnels"; // site that doesn’t send Access-Control-*
        const utilityUrl = proxyurl + "invoice/utilities"; // site that doesn’t send Access-Control-*
        let apartmentsAndOwners = [];
        fetch(utilityUrl)
            .then(response => response.json())
            .then(invoicesRetreived => {
                invoices = invoicesRetreived;
            })
            .catch((err) => console.log(err))
            .finally(() => {
                if (invoices.length > 0)
                    fetch(apartmentsUrl)
                        .then(response => response.json())
                        .then(contents => {
                            if (contents.length) {
                                setApartments(contents);
                                let allPersonnels = [];
                                fetch(personnelUrl)
                                    .then(response => response.json())
                                    .then(personnels => {
                                        allPersonnels = personnels;
                                        if (personnels.length) {
                                            setOwners(personnels);
                                            apartmentsAndOwners = setApartmentAndOwners([...contents], [...personnels]);
                                        }

                                    })
                                    .catch(() => console.log("Can’t access " + personnelUrl + " response. Blocked by browser?"))
                                    .finally(() => {
                                        if (allPersonnels.length)
                                            fetch(proxyurl + 'managementCompanies')
                                                .then(response => response.json())
                                                .then(company => {
                                                    setManagementCompany(company);
                                                })
                                                .catch(er => console.log(er))
                                                .finally(() => {
                                                    getApartmentsAndOwners(invoices, apartmentsAndOwners);
                                                    //getApartmentsAndOwners(apartmentsAndOwners);
                                                    //getApartmentsAndOwners(apartmentsAndOwners);
                                                });
                                    });
                            }

                        })
                        .catch((err) => console.log("Can’t access " + apartmentsUrl + " response. Blocked by browser?", err));
            });
    }

    const setApartmentAndOwners = (apartments, personnels) => {
        apartments.forEach(apartment => {
            personnels.forEach(personnel => {
                if (apartment.owner_id === personnel.personnel_id) {
                    apartment["owner_name"] = personnel.name;
                    apartment["agreement"] = personnel.agreement_code;
                    apartment["owner_bin"] = personnel.iin;
                    apartment["owner_iin"] = personnel.bin;
                }
            })
        });
        return apartments;
    }

    const getApartmentsAndOwners = (invoices, apartmentsAndOwners) => {
        invoices.forEach((element, index) => {
            apartmentsAndOwners.forEach(apartment => {
                if (element.apartment_id === apartment.apartment_id) {
                    invoices[index] = {
                        ...invoices[index],
                        apartment_id: apartment.apartment_id,
                        apartment: apartment.number,
                        owner_name: apartment.owner_name,
                        agreement: apartment.agreement,
                        owner_bin: apartment.owner_bin,
                        owner_iin: apartment.owner_iin,
                        share: apartment.share,
                        area: apartment.area,
                        address: apartment.address,
                        total_payments: invoices[index].payment_online + invoices[index].payment_offline + invoices[index].payment_user_balance
                    };
                }
            })
        });
        setUtilities([...invoices]);
        setFilteredUtilities([...invoices]);
        setAdvancedFilteredUtilities([...invoices]);
        // const utilityUrl = proxyurl + "invoice/utilities"; // site that doesn’t send Access-Control-*
        // let utilityData = [];
        // apartmentsAndOwners.forEach(apartment => {

        //     fetch(utilityUrl +
        //         `?apartment_id=${apartment.apartment_id}`)
        //         .then(response => response.json())
        //         .then(utility => {
        //             Object.assign(utility, {
        //                 apartment_id: apartment.apartment_id,
        //                 apartment: apartment.number,
        //                 owner_name: apartment.owner_name,
        //                 agreement: apartment.agreement,
        //                 owner_bin: apartment.owner_bin,
        //                 owner_iin: apartment.owner_iin,
        //                 share: apartment.share,
        //                 area: apartment.area,
        //                 address: apartment.address
        //             });
        //             utilityData.push({ utility });
        //         })
        //         .catch(er => console.log(er))
        //         .finally(() => {
        //             setUtilities([...utilityData]);
        //             setFilteredUtilities([...utilityData]);
        //             setAdvancedFilteredUtilities([...utilityData]);
        //         });
        // })

    }

    const filterData = (e, searchItem) => {

        setSearchValue(e.target.value);
        let newFilterValues = { ...filterValues };
        newFilterValues[searchItem] = e.target.value;
        let newItems = getFilteredUtilities(utilities, newFilterValues.apartment.split(" "), "apartment");
        newItems = getFilteredUtilities(newItems, newFilterValues.date_stamp.split(" "), "date_stamp");
        newItems = getFilteredUtilities(newItems, newFilterValues.owner_name.split(" "), "owner_name");

        let newCheckboxState = [];
        newItems.forEach(utilityEl => {
            let checkIndex = checkboxes.findIndex(checkbox => checkbox === utilityEl.invoice_id.toString());
            if (checkIndex > -1)
                newCheckboxState.push(utilityEl.invoice_id.toString())
        });
        setFilterValues(newFilterValues);

        setCheckbox(newCheckboxState);
        setFilteredUtilities(newItems);
    };

    const getFilteredUtilities = (utilities, text, searchItem) => {
        return utilities.filter(function (item) {
            return text.every(function (el) {
                if (searchItem === "date_stamp") {
                    return new Date(item.date_stamp).getFullYear().toString().indexOf(el) > -1
                } else if (searchItem) {
                    return item[searchItem].indexOf(el) > -1;
                } else {
                    return item.apartment.indexOf(el) > -1
                }
                // return item[searchItem].indexOf(el) > -1 ||
                //     item.apartment.indexOf(el) > -1 ||
                //     new Date(item.date_stamp).getFullYear().toString().indexOf(el) > -1
                // item.online.toString().indexOf(el) > -1 ||
                // item.offline.toString().indexOf(el) > -1 ||
                // item.used_balance.toString().indexOf(el) > -1 ||
                // item.used_savings.toString().indexOf(el) > -1 ||
                // item.electricity_amount.toString().indexOf(el) > -1 ||
                // item.cold_water_amount.toString().indexOf(el) > -1 ||
                // item.heating_amount.toString().indexOf(el) > -1
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
                            { label: 'Apartment', key: 'apartment' },
                            { label: 'Month', key: 'date_stamp' },
                            { label: 'Invoice', key: 'amount' },
                            { label: 'Online', key: 'payment_online' },
                            { label: 'Offline', key: 'payment_offline' },
                            // { label: 'Used savings', key: 'used_savings' },
                            { label: 'Used balance', key: 'payment_user_balance' },
                            { label: 'Total payments', key: 'total_payments' },
                            { label: 'Electricity', key: 'electricity_amount' },
                            // { label: 'Electricity tax', key: 'electricity_tax' },
                            { label: 'Cold water', key: 'cold_water_amount' },
                            // { label: 'Cold water tax', key: 'cold_water_tax' },
                            { label: 'Heating', key: 'heating_amount' },
                            // { label: 'Heating tax', key: 'heating_tax' },
                        ];
                        let data = [];
                        checkboxes.forEach((invoice_id) => {
                            utilities.forEach((utility) => {
                                if (utility.invoice_id === +invoice_id) {
                                    utility.total_payments = utility.payment_online + utility.payment_offline + utility.payment_user_balance;
                                    data.push(utility);
                                }
                            })
                        })
                        setIsExport({ data: data, headers: headers, csvModal: true });
                    }
                    break;
                case 'Upload table of the new invoices':
                    setIsUpload(true)
                    break;
                case 'Export PDF of the invoice':
                    if (checkboxes.length > 0) {
                        let allCheckboxes = [...checkboxes];
                        let invoices = [];
                        invoices = filteredUtilities.filter(el => {
                            let contains = allCheckboxes.includes(el.invoice_id.toString());
                            if (contains) {
                                el.company_iik = managementCompany[0].iik;
                                el.company_rnn = managementCompany[0].rnn;
                                el.company_bin = managementCompany[0].bin;
                                el.company_bik = managementCompany[0].bik;
                                el.company_iin = managementCompany[0].iin;
                                el.company_kbe = managementCompany[0].kbe;
                                el.bank_name = managementCompany[0].bank_name;
                                el.company_address = managementCompany[0].address;
                                el.company_name = managementCompany[0].name;
                                el.company_phone = managementCompany[0].phone_number;
                            }
                            return contains;
                        });
                        setPdfInvoices(invoices);
                        setPdfModal(true);
                    }
                    //window.open(downloadLink, "_blank")
                    break;
                case "Edit Offline":
                    if (checkboxes.length === 1) {
                        let invoices = [];
                        let allCheckboxes = [...checkboxes];
                        invoices = filteredUtilities.filter(el => {
                            let contains = allCheckboxes.includes(el.invoice_id.toString());
                            if (contains) {
                                el.company_iik = managementCompany[0].iik;
                                el.company_rnn = managementCompany[0].rnn;
                                el.company_bin = managementCompany[0].bin;
                                el.company_bik = managementCompany[0].bik;
                                el.company_iin = managementCompany[0].iin;
                                el.company_kbe = managementCompany[0].kbe;
                                el.bank_name = managementCompany[0].bank_name;
                                el.company_address = managementCompany[0].address;
                                el.company_name = managementCompany[0].name;
                                el.company_phone = managementCompany[0].phone_number;
                            }
                            return contains;
                        });
                        makeEditableOffline(invoices[0].invoice_id);
                    }
                    break;
                case 'Remove choosen utilities':
                    if (checkboxes.length > 0)
                        showDelete();
                    break;
            }
            setAction("Choose action");
        }
    };


    const removeSelectedUtilities = () => {
        const deleteUrl = proxyurl + "invoice/utilities?id=";
        let allCheckboxes = [...checkboxes];
        let utilitiesToDelete = [...checkboxes];
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
                        let itemIndex = utilitiesToDelete.findIndex(el => el === id);
                        utilitiesToDelete.splice(itemIndex, 1);
                        console.log("Try again!");
                    }
                })
                .catch(() => {
                    allSucceed = false;
                    let itemIndex = utilitiesToDelete.findIndex(el => el === id);
                    utilitiesToDelete.splice(itemIndex, 1);
                    console.log("Can’t access " + deleteUrl + " response. Blocked by browser?")
                })
                .finally(() => {
                    let checkboxesToSet = [...allCheckboxes];
                    if (counter === allCheckboxes.length) {
                        if (allSucceed) {
                            setOperationSuccessful({
                                success: '2',
                                message: "Utilities deleted successfully!"
                            });
                        } else {
                            setOperationSuccessful({
                                success: '3',
                                message: "Selected utilities could not be deleted!"
                            });
                        }
                        setTimeout(() => {
                            setOperationSuccessful({
                                success: '1',
                                message: ""
                            });
                        }, 4000);
                        cancelDelete();
                        let allUtilities = [...filteredUtilities];
                        let index = -1;

                        allUtilities.forEach((el, apartIndex) => {
                            allUtilities[apartIndex] = { ...el };
                        });

                        for (let v = 0; v < utilitiesToDelete.length; v++) {

                            index = allUtilities.findIndex(el => {
                                return el["invoice_id"] === +utilitiesToDelete[v]
                            });
                            if (index == -1)
                                continue;
                            allUtilities.splice(index, 1);
                            checkboxesToSet.splice(v, 1);
                        };

                        setFilteredUtilities(allUtilities);
                        setAdvancedFilteredUtilities(allUtilities);
                        setUtilities(allUtilities);
                        setCheckbox(checkboxesToSet);
                    }
                    setAction("Choose action");
                });
        });

    }

    const saveEdit = (utility) => {

        let allUtilities = [...filteredUtilities];

        let index = -1;

        allUtilities.forEach((el, id) => {
            allUtilities[id] = { ...el };
            if (el["invoice_id"] === utility.utilities_invoice_id) {
                index = id;
            }
        });

        Object.assign(allUtilities[index], utility, { isEditable: false });
        setFilteredUtilities(allUtilities);
        setAdvancedFilteredUtilities(allUtilities);
    }


    const saveUtility = (postData, method = "POST") => {
        if (method === "POST") {
            delete postData.utilities_invoice_id;
        }
        let postPersonnelUrl = proxyurl + "invoice/utilities";
        let postOfflineUrl = proxyurl81 + "payment/invoice/utility";

        if (postData.offline_edit) {
            delete postData.offline_edit;
            fetch(postOfflineUrl, {
                method: "POST",
                body: JSON.stringify(postData)
            }).
                then(res => {
                    if (res.ok) {
                        fetchData();
                        setOperationSuccessful({
                            success: '2',
                            message: "Offline edited successfully!"
                        });
                    } else {
                        setOperationSuccessful({
                            success: '3',
                            message: "Offline could not be created or edited!"
                        });

                    }

                }).
                catch((error) => {
                    setOperationSuccessful({
                        success: '3',
                        message: "Offline could not be created or edited!"
                    });
                    console.error('Error:', error);
                }).
                finally(() => {
                    setTimeout(() => {
                        setOperationSuccessful({
                            success: '1',
                            message: ""
                        });
                    }, 4000);
                });;
        } else {
            fetch(postPersonnelUrl, {
                method: method,
                body: JSON.stringify(postData)
            }).then((res) => {
                if (res.status === 200) {
                    if (method === "PUT") {
                        setOperationSuccessful({
                            success: '2',
                            message: "Utility edited successfully!"
                        });

                        fetchData();
                        // saveEdit(postData);
                    }
                    else {
                        setOperationSuccessful({
                            success: '2',
                            message: "Utility created successfully!"
                        });
                        fetchData();
                        //setIsCreate(false);
                    }
                }
                else {
                    setOperationSuccessful({
                        success: '3',
                        message: "Utility could not be created or edited!"
                    });
                }
            })
                .catch((error) => {
                    setOperationSuccessful({
                        success: '3',
                        message: "Utility could not be created or edited!"
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
                utilities.forEach(utilityEl => {
                    newCheckboxState.push(utilityEl.invoice_id.toString())
                });
            }
            else {
                newCheckboxState = [...checkboxes, e.target.name];
            }
            invoices = filteredUtilities.filter(el => {
                let contains = newCheckboxState.includes(el.invoice_id.toString());
                if (contains) {
                    el.company_iik = managementCompany[0].iik;
                    el.company_rnn = managementCompany[0].rnn;
                    el.company_bin = managementCompany[0].bin;
                    el.company_bik = managementCompany[0].bik;
                    el.company_iin = managementCompany[0].iin;
                    el.company_kbe = managementCompany[0].kbe;
                    el.bank_name = managementCompany[0].bank_name;
                    el.company_address = managementCompany[0].address;
                    el.company_name = managementCompany[0].name;
                    el.company_phone = managementCompany[0].phone_number;
                }
                return contains;
            });

            //setPdfInvoices(invoices);
            setCheckbox(newCheckboxState);
        } else {
            let allCheckboxes = [...checkboxes];
            let allInvoices = [...pdfInvoices];
            if (e.target.name === "all") {
                allCheckboxes = [];
                allInvoices = [];
            }
            else {
                let removeAtIndex = allCheckboxes.findIndex(el => el === e.target.name);
                allCheckboxes.splice(removeAtIndex, 1);
                let invoiceToDeleteIndex = allInvoices.findIndex(el => el.invoice_id === +e.target.name);
                allInvoices.splice(invoiceToDeleteIndex, 1);
            }
            //setPdfInvoices(allInvoices);
            setCheckbox(allCheckboxes);
        }
    }


    const removeUtility = (id) => {
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
                        message: "Utility deleted successfully!"
                    });
                    let allUtilities = [...filteredUtilities];
                    let index = -1;
                    allUtilities.forEach((el, apartIndex) => {
                        allUtilities[apartIndex] = { ...el };
                    });

                    index = allUtilities.findIndex(el =>
                        el["invoice_id"] === id
                    );

                    allUtilities.splice(index, 1);
                    setFilteredUtilities(allUtilities);
                    setAdvancedFilteredUtilities(allUtilities);
                    setUtilities(allUtilities);
                    setCheckbox([]);
                }
                else {
                    setOperationSuccessful({
                        success: '3',
                        message: "Utility could not be deleted!"
                    });
                }
                setAction("Choose action");

            });
    }

    const makeEditableOffline = (id) => {
        let allUtilities = [...filteredUtilities];

        allUtilities.forEach((el, index) => {

            allUtilities[index] = { ...el };
            if (+id === +el.invoice_id) {
                allUtilities[index].isEditableOffline = true;
                allUtilities[index].isEditable = false;
            }

        });

        setFilteredUtilities(allUtilities);
    }

    const makeEditable = (id) => {
        let allUtilities = [...filteredUtilities];

        allUtilities.forEach((el, index) => {

            allUtilities[index] = { ...el };
            if (+id === +el.invoice_id) {
                allUtilities[index].isEditable = true;
                allUtilities[index].isEditableOffline = false;

            }

        });

        setFilteredUtilities(allUtilities);

    }

    const loadMore = (count) => {
        setPaginationCount(paginationCount + count);
    }

    const removePdfModal = () => {
        setPdfModal(false);
    }

    // See more button
    let buttonType = null;
    if (filteredUtilities.length > 7 * paginationCount) {
        buttonType = <button className={headerclasses.filterButton} style={{ width: "10% !important" }} onClick={() => loadMore(+1)} > Load More </button>;
    }

    const cancelUpload = () => {
        setIsUpload(false);
        setAction("Choose action");
    }

    const cancelEdit = (id) => {
        let allUtilities = [...filteredUtilities];

        allUtilities.forEach((el, index) => {
            allUtilities[index] = { ...el };
            if (el.invoice_id === id) {
                allUtilities[index].isEditable = false;
                allUtilities[index].isEditableOffline = false;
            }
        });

        setFilteredUtilities(allUtilities);

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

                // setDataToFilter({
                //     ...dataToFilter,
                //     apartment: selectedValue
                // })
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
                // setDataToFilter({
                //     ...dataToFilter,
                //     month: getMonthFromString(selectedValue)
                // })
                break;
            case "Year":
                setDataToFilter({
                    ...dataToFilter,
                    year: selectedValue.target.value
                })
                break;
        };

    };

    const setAdvancedFilterUtilities = (reset) => {

        if (reset) {
            // let text = searchValue.split(' ');
            // let newItems = getFilteredUtilities([...utilities], text);
            // setFilteredUtilities([newItems]);
            // setAdvancedFilteredUtilities(newItems);
            setFilteredUtilities([]);

            setAdvancedFilteredUtilities([]);
            setUtilities([]);
            setDataToFilter({
                chosenOwners: [],
                chosenApartments: [],
                //change to current month and date!
                chosenMonths: [],
                year: new Date().getFullYear()
            });

        }
        else {
            let apartmentsAndOwners = setApartmentAndOwners([...apartments], [...owners]);

            const utilityUrl = proxyurl + "invoice/utilities"; // site that doesn’t send Access-Control-*
            let utilityData = [];
            if (dataToFilter.chosenApartments.length > 0) {
                dataToFilter.chosenApartments.forEach(chosenA => {
                    let apartment = apartments.filter(apar => apar.number === chosenA.number);
                    fetch(utilityUrl +
                        `?apartment_id=${apartment[0].apartment_id}`)
                        .then(response => response.json())
                        .then(utility => {
                            utility.forEach(uti => {
                                Object.assign(uti, {
                                    apartment_id: apartment[0].apartment_id,
                                    apartment: apartment[0].number,
                                    owner_name: apartment[0].owner_name,
                                    agreement: apartment[0].agreement,
                                    share: apartment[0].share,
                                    area: apartment[0].area,
                                    address: apartment[0].address
                                });
                            })
                            utilityData = [...utilityData, ...utility]

                        })
                        .catch(er => console.log(er))
                        .finally(() => {
                            let newItems = [];
                            let filteredData = [];
                            if (utilityData.length > 0) {
                                filteredData = utilityData.filter(el => {
                                    return (dataToFilter.chosenApartments.findIndex(elApart => (elApart.number) === el.apartment) > -1 || dataToFilter.chosenApartments.length === 0) &&
                                        (dataToFilter.chosenMonths.findIndex(elmonth => getMonthFromString(elmonth.name) === new Date(el.date_stamp).getMonth() + 1) > -1 || dataToFilter.chosenMonths.length === 0) &&
                                        (new Date(el.date_stamp).getFullYear() == dataToFilter.year || !dataToFilter.year) &&
                                        (dataToFilter.chosenOwners.findIndex(val => val.name === el.owner_name) > -1 || dataToFilter.chosenOwners.length == 0)
                                });
                                let text = searchValue.split(' ');
                                newItems = getFilteredUtilities(filteredData, text);
                            }
                            setAdvancedFilteredUtilities(newItems);
                            setFilteredUtilities(newItems);
                            setUtilities([...utilityData]);
                        });
                })
            }
            else {
                setAdvancedFilteredUtilities([]);
                setFilteredUtilities([]);
                setUtilities([]);
            }

        }
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

    const changed = (e) => {
        e.preventDefault();
        var files = fileRef.current.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            let readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/

            const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
            // utilities_invoice_id: +data['invoice_id'],
            // cold_water_value: +data['cold_water_value'],
            // cold_water_tax: +data['cold_water_tax'],
            // electricity_value: +data['electricity_value'],
            // electricity_tax: +data['electricity_tax'],
            // heating_value: +data['heating_value'],
            // heating_tax: +data['heating_tax'],
            // real_amount:0
            let postData = {
                invoices: []
            }
            dataParse.forEach((el, id) => {
                if (id !== 0) {
                    let element = {};
                    el.forEach((item, index) => {
                        switch (dataParse[0][index]) {
                            case "Owner":

                                break;
                            case "Apartment":
                                apartments.forEach(apartment => {
                                    if (apartment.number.toString() === item.toString()) {
                                        element.apartment_id = +apartment.apartment_id;
                                    }
                                });
                                break;
                            case "Month":
                                //date format MM-/.DD./-YYYY 
                                let date = XLSX.SSF.parse_date_code(+item);
                                element.date_stamp = (new Date(date.m + "/" + date.d + "/" + date.y)).toJSON();

                                break;
                            case "Invoice":

                                break;
                            case "Online":

                                break;
                            case "Offline":

                                break;
                            case "Used savings":

                                break;
                            case "Used balance":

                                break;
                            case "Total payments":

                                break;
                            case "Electricity":
                                element.electricity_amount = +item;

                                break;
                            // case "Electricity tax":

                            //     element.electricity_tax = +item;
                            //     break;
                            case "Cold water":
                                element.cold_water_amount = +item;
                                break;
                            // case "Cold water tax":
                            //     element.cold_water_tax = +item;
                            //     break;
                            case "Heating":
                                element.heating_amount = +item;
                                break;
                            // case "Heating tax":
                            //     element.heating_tax = +item;
                            //     break;
                        }
                    });
                    if (element.apartment_id > 0)
                        postData.invoices.push(element);
                }
            });

            fetch(proxyurl + "invoice/utilities", {
                method: "POST",
                body: JSON.stringify(postData)
            }).then(response => {
                if (response.ok) {
                    fetchData();
                    setIsUpload(false)

                } else {
                    setIsUpload(false)
                }
            }).catch(ex => console.log(ex));
            //array of arrays! 
        };
        reader.readAsBinaryString(f);

    }

    return (
        <>
            {operationSuccessful.success === '3' &&
                <ActionResponse text={operationSuccessful.message} class="btn-danger" />
            }
            {operationSuccessful.success === '2' &&
                <ActionResponse text={operationSuccessful.message} class="btn-success" />
            }
            {isUpload &&
                <ChooseFile fileRef={fileRef} cancelUpload={cancelUpload} changed={changed} />
            }
            {isExport.csvModal &&
                <CsvModal isExport={isExport} removeCsvModal={removeCsvModal} />
            }

            {isDeleting.delete1 &&
                <Remove
                    cancelDelete={cancelDelete}
                    removeItem={removeUtility}
                    id={isDeleting.delete1}
                    name="utility" />
            }

            {isDeleting.deleteN &&
                <Remove
                    cancelDelete={cancelDelete}
                    removeItem={removeSelectedUtilities}
                    name="utilities" />
            }

            <HeaderTop menuType="Utilities" />
            {/* <HeaderFilter
                owners={[...owners]}
                apartments={[...apartments]}
                advancedFilter={advancedFilter}
                availableMonths={availableMonths}
                dataToFilter={dataToFilter}
                setAdvancedFilterUtilities={setAdvancedFilterUtilities} /> */}

            <HeaderBottom
                action={action}
                totalNumber={filteredUtilities.length}
                items={actions}
                filterData={filterData}
                choosen={checkboxes.length}
                onChange={onChangeAction}
                type />
            {pdfModal &&
                <div >
                    <PdfDownloadModal invoices={pdfInvoices} removeModal={removePdfModal} />
                    {/* {pdfLinkGenerator(pdfInvoices)}; */}
                </div>
            }

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
                                <th style={{ minWidth: '125px' }}>Owner</th>
                                <th style={{ minWidth: '100px' }}>Apt.</th>
                                <th style={{ minWidth: '100px' }}>Month</th>
                                <th style={{ minWidth: '66px' }}>Invoice</th>
                                <th style={{ minWidth: '57px' }}>Online</th>
                                <th style={{ minWidth: '57px' }}>Offline</th>
                                {/* <th style={{ minWidth: '57px' }}>Used savings</th> */}
                                <th style={{ minWidth: '57px' }}>Used balance</th>
                                <th style={{ minWidth: '57px' }}>Total payments</th>
                                <th style={{ minWidth: '57px' }}>Electricity</th>
                                <th style={{ minWidth: '57px' }}>Cold water</th>
                                <th style={{ minWidth: '57px' }}>Heating</th>
                                <th style={{ minWidth: '73px' }}></th>
                                <th style={{ minWidth: '73px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUtilities.slice(0, 7 * paginationCount).map(el => {

                                return <Utility
                                    checked={checkboxes.findIndex(chel => +chel === el.invoice_id) > -1}
                                    key={el.invoice_id}
                                    utility={{ ...el }}
                                    edit={el.isEditable}
                                    onCancel={cancelEdit}
                                    checkboxClicked={onCheckboxClick}
                                    showDialog={showDelete}
                                    makeEditable={makeEditable}
                                    saveEdit={saveUtility} />
                            })
                            }
                            <tr>
                                <td></td>
                                <td>Total</td>
                                <td></td>
                                <td></td>
                                <td>{filteredUtilities.slice(0, 7 * paginationCount).reduce((sum, el2) => sum + el2.amount, 0).toFixed(2)}</td>
                                <td></td>
                                <td></td>
                                {/* <td>...</td> */}
                                <td></td>
                                <td>{filteredUtilities.slice(0, 7 * paginationCount).reduce((sum, el2) => sum + el2.total_payments, 0).toFixed(2)}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>

                        </tbody>
                    </table>

                    {/* {utilities.length === 0 &&
                        <p className="mt-5">List of the invoices is empty, please set filter above to get invoices for particular or list of the apartments !</p>
                    } */}
                    <div style={{ textAlign: 'left', width: "10%" }}>
                        {buttonType}
                    </div>
                </main>
            </div>
        </>
    );
}

export default Utilities;