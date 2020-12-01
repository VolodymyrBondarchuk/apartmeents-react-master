import React, { useState, useEffect } from 'react';
import Owner from './Owner';
import CreateEditOwnerFields from './CreateEditOwnerFields';
import { proxyurl } from '../services/services';
import HeaderTop from '../Headers/HeaderTop';
import HeaderBottom from '../Headers/HeaderBottom';
import Remove from '../UI/Remove';
import ActionResponse from '../UI/ActionResponse';
import classes from '../Headers/Header.module.css';
import utilitiesClasses from '../Utilities/Utilities.module.css';

const Owners = (props) => {
    //http://cors-anywhere.herokuapp.com/ 
    const [action, setAction] = useState("Choose action");
    const [personnels, setPersonnels] = useState([]);
    const [filteredPersonnels, setFilteredPersonnels] = useState([]);
    const [checkboxes, setCheckbox] = useState([]);
    const [paginationCount, setPaginationCount] = useState(1);
    const [isCreate, setIsCreate] = useState(false);
    const [operationSuccessful, setOperationSuccessful] = useState({
        success: '1',
        message: ''
    });
    const actions = ["Choose action", "Create new owner", "Create invite code", "Remove choosen owners"];
    const [isDeleting, setIsDeleting] = useState({
        delete1: false,
        deleteN: false
    });


    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = () => {
        const personnelUrl = proxyurl + "personnels"; // site that doesn’t send Access-Control-* 
        fetch(personnelUrl)
            .then(response => response.json())
            .then(contents => {
                if (contents.length) {
                    setPersonnels(contents);
                    setFilteredPersonnels(contents);
                }

            })
            .catch((err) => console.log("Can’t access " + personnelUrl + " response. Blocked by browser?", err));
    }

    const filterData = (e) => {
        let text = e.target.value.split(' ');
        let newItems = personnels.filter(function (item) {
            return text.every(function (el) {
                return item.agreement_code.indexOf(el) > -1 ||
                    item.bin.indexOf(el) > -1 ||
                    item.iin.indexOf(el) > -1 ||
                    item.name.indexOf(el) > -1 ||
                    item.phone.indexOf(el) > -1;
            });
        });
        let newCheckboxState = [];
        newItems.forEach(ownerEl => {
            let checkIndex = checkboxes.findIndex(checkbox => checkbox === ownerEl.personnel_id.toString());
            if (checkIndex > -1)
                newCheckboxState.push(ownerEl.personnel_id.toString())
        });
        setCheckbox(newCheckboxState);
        setFilteredPersonnels(newItems);
    };

    const onChangeAction = (event) => {

        if (action !== event.target.value) {
            switch (event.target.value) {
                case 'Create new owner':
                    setIsCreate(true);
                    break;
                case 'Create invite code':
                    createInviteCode();
                    break;
                case 'Remove choosen owners':
                    if (checkboxes.length > 0)
                        showDelete();
                    break;
            }
            setAction("Choose action");
        }
    };

    const createInviteCode = () => {

    }

    const removeSelectedOwners = () => {
        const deleteUrl = proxyurl + "personnel?id=";
        let allCheckboxes = [...checkboxes];
        let ownersToDelete = [...checkboxes];

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
                        let itemIndex = ownersToDelete.findIndex(el => el === id);
                        ownersToDelete.splice(itemIndex, 1);
                        console.log("Try again!");
                    }
                })
                .catch(() => {
                    allSucceed = false;
                    let itemIndex = ownersToDelete.findIndex(el => el === id);
                    ownersToDelete.splice(itemIndex, 1);
                    console.log("Can’t access " + deleteUrl + " response. Blocked by browser?")
                })
                .finally(() => {

                    let checkboxesToSet = [...allCheckboxes];
                    if (counter === allCheckboxes.length) {
                        if (allSucceed) {
                            setOperationSuccessful({
                                success: '2',
                                message: "Owners deleted successfully!"
                            });
                        } else {
                            setOperationSuccessful({
                                success: '3',
                                message: "Selected owners could not be deleted!"
                            });
                        }
                        setTimeout(() => {
                            setOperationSuccessful({
                                success: '1',
                                message: ""
                            });
                        }, 4000);
                        cancelDelete();
                        let allPersonnels = [...filteredPersonnels];
                        let index = -1;

                        allPersonnels.forEach((el, apartIndex) => {
                            allPersonnels[apartIndex] = { ...el };
                        });


                        for (let v = 0; v < ownersToDelete.length; v++) {
                            index = allPersonnels.findIndex(el =>
                                el["personnel_id"] === +ownersToDelete[v]
                            );
                            if (index == -1) {
                                continue;
                            }
                            allPersonnels.splice(index, 1);
                            checkboxesToSet.splice(v, 1);
                        };

                        setFilteredPersonnels(allPersonnels);
                        setPersonnels(allPersonnels);
                        setCheckbox(checkboxesToSet);
                    }
                });
        });

    }

    const saveEdit = (personnel) => {

        let allPersonnel = [...filteredPersonnels];

        let index = -1;

        allPersonnel.forEach((el, id) => {
            allPersonnel[id] = { ...el };
            if (el["personnel_id"] === personnel.personnel_id) {
                index = id;
            }
        });

        allPersonnel.splice(index, 1, personnel);
        setFilteredPersonnels(allPersonnel);
    }


    const savePersonnel = (postData, method = "POST") => {
        if (method === "POST") {
            delete postData.personnel_id;
        }
        let postPersonnelUrl = proxyurl + "personnel";
        fetch(postPersonnelUrl, {
            method: method,
            body: JSON.stringify(postData)
        }).then((res) => {
            if (res.status === 200) {
                if (method === "PUT") {
                    saveEdit(postData);
                    setOperationSuccessful({
                        success: '2',
                        message: "Owner edited successfully!"
                    });
                }
                else {
                    setOperationSuccessful({
                        success: '2',
                        message: "Owner created successfully!"
                    });
                    fetchData();
                    setIsCreate(false);
                }
            }
            else {
                setOperationSuccessful({
                    success: '3',
                    message: "Owner could not be created or edited!"
                });
            }
        })
            .catch((error) => {
                setOperationSuccessful({
                    success: '3',
                    message: "Owner could not be created or edited!"
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
                personnels.forEach(perseonnelEl => {
                    newCheckboxState.push(perseonnelEl.personnel_id.toString())
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



    const removePersonnel = (id) => {
        let success = false;
        const deleteUrl = proxyurl + "personnel?id=";
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
                        message: "Owner deleted successfully!"
                    });
                    let allPersonnel = [...filteredPersonnels];
                    let index = -1;
                    allPersonnel.forEach((el, apartIndex) => {
                        allPersonnel[apartIndex] = { ...el };
                    });

                    index = allPersonnel.findIndex(el =>
                        el["personnel_id"] === id
                    );

                    allPersonnel.splice(index, 1);
                    setFilteredPersonnels(allPersonnel);
                    setPersonnels(allPersonnel);
                    setCheckbox([]);
                } else {
                    setOperationSuccessful({
                        success: '3',
                        message: "Owner could not be deleted!"
                    });
                }

                setAction("Choose action");

            });
    }


    const makeEditable = (id) => {
        let allPersonnel = [...filteredPersonnels];

        allPersonnel.forEach((el, index) => {

            allPersonnel[index] = { ...el };
            if (+id === +el.personnel_id) {
                allPersonnel[index].isEditable = true
            }

        });

        setFilteredPersonnels(allPersonnel);
    }

    const loadMore = (count) => {
        setPaginationCount(paginationCount + count);
    }


    const cancelCreation = () => {
        setIsCreate(false);
    }

    const cancelEdit = (id) => {
        let allPersonnels = [...filteredPersonnels];

        allPersonnels.forEach((el, index) => {
            allPersonnels[index] = { ...el };
            if (el.personnel_id === id)
                allPersonnels[index].isEditable = false;
        });

        setFilteredPersonnels(allPersonnels);
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
    if (filteredPersonnels.length > 7 * paginationCount) {
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
                    removeItem={removePersonnel}
                    id={isDeleting.delete1}
                    name="personnel" />
            }

            {isDeleting.deleteN &&
                <Remove
                    cancelDelete={cancelDelete}
                    removeItem={removeSelectedOwners}
                    name="personnels" />
            }

            <HeaderTop menuType="Owners" />

            <HeaderBottom
                action={action}
                totalNumber={filteredPersonnels.length}
                items={actions}
                filterData={filterData}
                choosen={checkboxes.length}
                onChange={onChangeAction} />


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
                                <th style={{ minWidth: '155px' }}>Name</th>
                                <th style={{ minWidth: '120px' }}>Phone</th>
                                <th style={{ minWidth: '127px' }}>Agreement code</th>
                                <th style={{ minWidth: '100px' }}>Doc ID</th>
                                <th style={{ minWidth: '130px' }}>Company ID</th>
                                <th style={{ minWidth: '73px' }}></th>
                                <th style={{ minWidth: '73px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isCreate &&
                                <CreateEditOwnerFields onClick={savePersonnel} onCancel={cancelCreation} />}

                            {filteredPersonnels.slice(0, 7 * paginationCount).map(el => {
                                return <Owner
                                    checked={checkboxes.findIndex(chel => +chel === el.personnel_id) > -1}
                                    key={el.personnel_id}
                                    personnel={{ ...el }}
                                    edit={el.isEditable}
                                    onCancel={cancelEdit}
                                    checkboxClicked={onCheckboxClick}
                                    makeEditable={makeEditable}
                                    showDialog={showDelete}
                                    saveEdit={savePersonnel} />
                            })
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

export default Owners;