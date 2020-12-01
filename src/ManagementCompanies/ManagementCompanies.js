import React, { useEffect, useState } from 'react';
import Company from './Company';
import CreateEditCompanyFields from './CreateEditCompanyFields';
import { proxyurl } from '../services/services';
import HeaderTop from '../Headers/HeaderTop';
import HeaderBottom from '../Headers/HeaderBottom';
import Remove from '../UI/Remove';
import ActionResponse from '../UI/ActionResponse';
import classes from '../Headers/Header.module.css';
import utilitiesClasses from '../Utilities/Utilities.module.css';

const ManagementCompanies = (props) => {
    const [checkboxes, setCheckbox] = useState([]);

    const [action, setAction] = useState("Choose action");
    const [paginationCount, setPaginationCount] = useState(1);
    const [filteredManagCompanies, setFilteredManagCompanies] = useState([]);
    const [managCompanies, setManagCompanies] = useState([]);
    const [isCreate, setIsCreate] = useState(false);
    const [isDeleting, setIsDeleting] = useState({
        delete1: '',
        deleteN: ''
    });
    const [operationSuccessful, setOperationSuccessful] = useState({
        success: '1',
        message: ''
    });
    const listActions = [
        "Choose action",
        "Create new invoice",
        "Remove chosen invoice"];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        const managCompaniesUrl = proxyurl + "managementCompanies"; // site that doesn’t send Access-Control-* 
        fetch(managCompaniesUrl)
            .then(response => response.json())
            .then(contents => {
                if (contents.length) {
                    setManagCompanies(contents);
                    setFilteredManagCompanies(contents);
                }
            })
            .catch((err) => console.log("Can’t access " + managCompaniesUrl + " response. Blocked by browser?", err));
    }

    const filterData = (e) => {
        let text = e.target.value.split(' ');
        let newItems = managCompanies.filter(function (item) {
            return text.every(function (el) {
                return item.address.indexOf(el) > -1 ||
                    item.bank_name.indexOf(el) > -1 ||
                    item.bik.indexOf(el) > -1 ||
                    item.bin.indexOf(el) > -1 ||
                    item.iik.indexOf(el) > -1 ||
                    item.iin.indexOf(el) > -1 ||
                    item.kbe.indexOf(el) > -1 ||
                    item.name.indexOf(el) > -1 ||
                    item.phone_number.indexOf(el) > -1 ||
                    item.rnn.indexOf(el) > -1;
            });
        });
        let newCheckboxState = [];
        newItems.forEach(company => {
            let checkIndex = checkboxes.findIndex(checkbox => checkbox === company.management_company_id.toString());
            if (checkIndex > -1)
                newCheckboxState.push(company.management_company_id.toString())
        });
        setCheckbox(newCheckboxState);
        setFilteredManagCompanies(newItems);
    };



    const onChangeAction = (event) => {

        if (action !== event.target.value) {
            switch (event.target.value) {
                case 'Create new invoice':
                    setIsCreate(true);
                    break;
                case 'Remove chosen invoice':
                    if (checkboxes.length > 0)
                        showDelete();
                    break;
            }
            setAction("Choose action");
        }
    };

    const removeSelectedInvoices = () => {
        const deleteUrl = proxyurl + "managementCompany?id=";
        let allCheckboxes = [...checkboxes];
        let counter = 0;
        let allSucceed = true;

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
                        console.log("Try again!");
                    }
                })
                .catch(() => {
                    console.log("Can’t access " + deleteUrl + " response. Blocked by browser?")
                })
                .finally(() => {
                    if (counter === allCheckboxes.length - 1) {
                        if (allSucceed) {
                            setOperationSuccessful({
                                success: '2',
                                message: "Companies deleted successfully!"
                            });
                        } else {
                            setOperationSuccessful({
                                success: '3',
                                message: "Selected companies could not be deleted!"
                            });
                        }
                        setTimeout(() => {
                            setOperationSuccessful({
                                success: '1',
                                message: ""
                            });
                        }, 4000);
                        cancelDelete();
                        let allCompanies = [...filteredManagCompanies];
                        let index = -1;
                        allCompanies.forEach((el, apartIndex) => {
                            allCompanies[apartIndex] = { ...el };
                        });


                        for (let elementId of allCheckboxes) {
                            index = allCompanies.findIndex(el =>
                                el["management_company_id"] === +elementId
                            );
                            if (index == -1)
                                continue;
                            allCompanies.splice(index, 1);
                        };

                        setFilteredManagCompanies(allCompanies);
                        setManagCompanies(allCompanies);
                        setCheckbox([]);
                    }
                    setAction("Choose action");

                });
        });

    }

    const saveEdit = (company) => {

        let allCompanies = [...filteredManagCompanies];

        let index = -1;

        allCompanies.forEach((el, id) => {
            allCompanies[id] = { ...el };
            if (el["management_company_id"] === company.management_company_id) {
                index = id;
            }
        });

        allCompanies.splice(index, 1, company);
        setFilteredManagCompanies(allCompanies);
    }


    const saveCompany = (postData, method = "POST") => {
        if (method === "POST") {
            delete postData.management_company_id;
        }
        let postCompanyUrl = proxyurl + "managementCompany";
        fetch(postCompanyUrl, {
            method: method,
            body: JSON.stringify(postData)
        }).then((res) => {
            if (res.status === 200) {
                if (method === "PUT") {
                    saveEdit(postData);
                    setOperationSuccessful({
                        success: '2',
                        message: "Company edited successfully!"
                    });
                }
                else {
                    setOperationSuccessful({
                        success: '2',
                        message: "Company created successfully!"
                    });
                    fetchData();
                    setIsCreate(false);
                }
            } else {
                setOperationSuccessful({
                    success: '3',
                    message: "Company could not be created or edited!"
                });
            }
        })
            .catch((error) => {
                setOperationSuccessful({
                    success: '3',
                    message: "Company could not be created or edited!"
                });
                console.error('Error:', error);
            }).finally(() => {
                setTimeout(() => {
                    setOperationSuccessful({
                        success: '1',
                        message: ""
                    });
                }, 4000)
            });
    }

    const onCheckboxClick = (e) => {
        if (e.target.checked) {
            let newCheckboxState = [];
            if (e.target.name === "all") {
                managCompanies.forEach(company => {
                    newCheckboxState.push(company.management_company_id.toString())
                });
            }
            else {
                newCheckboxState = [...checkboxes, e.target.name];
            }
            setCheckbox(newCheckboxState);
        } else {
            let allCheckboxes = [...checkboxes];
            if (e.target.name === "all") {
                allCheckboxes = [];
            }
            else {
                let removeAtIndex = allCheckboxes.findIndex(el => el === e.target.name);
                allCheckboxes.splice(removeAtIndex, 1);
            }
            setCheckbox(allCheckboxes);
        }
    }

    const removeCompany = (id) => {
        let success = false;
        const deleteUrl = proxyurl + "managementCompany?id=";
        fetch(deleteUrl + id, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
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
                cancelDelete();
                setTimeout(() => {
                    setOperationSuccessful({
                        success: '1',
                        message: ""
                    });
                }, 4000);
                if (success) {
                    setOperationSuccessful({
                        success: '2',
                        message: "Company deleted successfully!"
                    });
                    let allCompanies = [...filteredManagCompanies];
                    let index = -1;
                    allCompanies.forEach((el, apartIndex) => {
                        allCompanies[apartIndex] = { ...el };
                    });

                    index = allCompanies.findIndex(el =>
                        el["management_company_id"] === id
                    );

                    allCompanies.splice(index, 1);
                    setFilteredManagCompanies(allCompanies);
                    setManagCompanies(allCompanies);
                    setCheckbox([]);
                } else {
                    setOperationSuccessful({
                        success: '3',
                        message: "Company could not be deleted!"
                    });
                }

            });
    }


    const makeEditable = (id) => {
        let allCompanies = [...filteredManagCompanies];

        allCompanies.forEach((el, index) => {

            allCompanies[index] = { ...el };
            if (+id === +el.management_company_id) {
                allCompanies[index].isEditable = true
            }

        });

        setFilteredManagCompanies(allCompanies);
    }

    const loadMore = (count) => {
        setPaginationCount(paginationCount + count);
    }


    const cancelCreation = () => {
        setIsCreate(false);
        setAction("Choose action");
    }

    const cancelEdit = (id) => {

        let allCompanies = [...filteredManagCompanies];


        allCompanies.forEach((el, index) => {
            allCompanies[index] = { ...el };
            if (el.management_company_id === id)
                allCompanies[index].isEditable = false;
        });

        setFilteredManagCompanies(allCompanies);
        setAction("Choose action");
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
    }

    // See more button
    let buttonType = null;
    if (filteredManagCompanies.length > 7 * paginationCount) {
        buttonType = <button className={classes.filterButton} style={{ width: "10% !important" }} onClick={() => loadMore(+1)} > Load More </button>;
    }

    return (
        <>
            {operationSuccessful.success === '3' &&
                <ActionResponse text={operationSuccessful.message} class="btn-danger" />
            }
            {operationSuccessful.success === '2' &&
                <ActionResponse text={operationSuccessful.message} class="btn-success" />
            }
            {isDeleting.delete1 &&
                <Remove
                    cancelDelete={cancelDelete}
                    removeItem={removeCompany}
                    id={isDeleting.delete1}
                    name="company" />
            }

            {isDeleting.deleteN &&
                <Remove
                    cancelDelete={cancelDelete}
                    removeItem={removeSelectedInvoices}
                    name="companies" />
            }

            <HeaderTop menuType="Management company" />
            <HeaderBottom
                action={action}
                totalNumber={filteredManagCompanies.length}
                items={listActions}
                filterData={filterData}
                choosen={checkboxes.length}
                onChange={onChangeAction} />

            <div className="App">
                <header className="App-header">
                </header>
                <main>
                    <table className={utilitiesClasses.MainTable}>
                        <thead >
                            <tr >
                                <th style={{ float: 'left' }}>
                                    <input
                                        type="checkbox"
                                        name="all"
                                        onChange={onCheckboxClick} /></th>
                                <th style={{ minWidth: '125px' }}>Company name</th>
                                <th style={{ minWidth: '60px' }}>BIN</th>
                                <th style={{ minWidth: '100px' }}>IIN</th>
                                <th style={{ minWidth: '66px' }}>IIK</th>
                                <th style={{ minWidth: '57px' }}>KBE</th>
                                <th style={{ minWidth: '57px' }}>KNP</th>
                                <th style={{ minWidth: '57px' }}>Name of the Bank</th>
                                <th style={{ minWidth: '57px' }}>BIK</th>
                                <th style={{ minWidth: '57px' }}>Adress</th>
                                <th style={{ minWidth: '57px' }}>RNN</th>
                                <th style={{ minWidth: '57px' }}>Phone number</th>
                                <th style={{ minWidth: '73px' }}></th>
                                <th style={{ minWidth: '73px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isCreate &&
                                <CreateEditCompanyFields onClick={saveCompany} onCancel={cancelCreation} />}

                            {filteredManagCompanies.slice(0, 7 * paginationCount).map(el =>
                                <Company
                                    checked={checkboxes.findIndex(chel => +chel === el.management_company_id) > -1}
                                    key={el.management_company_id}
                                    company={{ ...el }}
                                    edit={el.isEditable}
                                    onCancel={cancelEdit}
                                    checkboxClicked={onCheckboxClick}
                                    makeEditable={makeEditable}
                                    showDialog={showDelete}
                                    saveEdit={saveCompany} />)
                            }

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

export default ManagementCompanies;