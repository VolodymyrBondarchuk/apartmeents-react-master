import React, { useEffect, useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Apartment from './Apartment';
import CreateEditApartmentFields from './CreateEditApartmentFields';
import { proxyurl } from '../services/services';
import HeaderBottom from '../Headers/HeaderBottom';
import HeaderTop from '../Headers/HeaderTop';
import Remove from '../UI/Remove';
import ActionResponse from '../UI/ActionResponse';
import classes from '../Headers/Header.module.css';
import utilitiesClasses from '../Utilities/Utilities.module.css';

function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [personnels, setPersonnels] = useState([]);
  const [checkboxes, setCheckbox] = useState([]);
  const [action, setAction] = useState("Choose action");
  const [isCreate, setIsCreate] = useState(false);
  const [paginationCount, setPaginationCount] = useState(1);
  const [operationSuccessful, setOperationSuccessful] = useState({
    success: '1',
    message: ''
  });
  const [isDeleting, setIsDeleting] = useState({
    delete1: '',
    deleteN: ''
  });

  const actions = ["Choose action", "Create new apartment", "Remove chosen apartments"];


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const apartmentsUrl = proxyurl + "apartments"; // site that doesn’t send Access-Control-*
    const personnelUrl = proxyurl + "personnels"; // site that doesn’t send Access-Control-*
    fetch(apartmentsUrl)
      .then(response => response.json())
      .then(contents => {
        if (contents.length)
          fetch(personnelUrl)
            .then(response => response.json())
            .then(personnels => {
              contents.forEach(apartment => {
                personnels.forEach(personnel => {
                  if (apartment.owner_id === personnel.personnel_id) {
                    apartment["owner_name"] = personnel.name;
                  }
                })
              });
              contents.forEach(el => {
                el.isEditable = false;
              })

              setApartments(contents);
              setFilteredApartments(contents);
              setPersonnels(personnels);
            })
            .catch(() => console.log("Can’t access " + personnelUrl + " response. Blocked by browser?"));
      })
      .catch((err) => console.log("Can’t access " + apartmentsUrl + " response. Blocked by browser?", err)).
      finally(() => {
        if (personnelUrl) {
          fetch(personnelUrl)
            .then(response => response.json())
            .then(personnels => {
              setPersonnels(personnels);
            }).catch(er => console.log(er));

        }
      })
  }


  const onCheckboxClick = (e) => {
    if (e.target.checked) {
      let newCheckboxState = [];
      if (e.target.name === "all") {
        apartments.forEach(apartmentEl => {
          newCheckboxState.push(apartmentEl.apartment_id.toString())
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


  const onChangeAction = (event) => {

    if (action !== event.target.value) {
      switch (event.target.value) {
        case 'Create new apartment':
          if (personnels.length > 0)
            setIsCreate(true);
          break;
        case 'Remove chosen apartments':
          if (checkboxes.length > 0)
            showDelete();
          break;
      }
      setAction("Choose action");
    }
  }

  const removeApartment = (id) => {
    let success = false;
    const deleteUrl = proxyurl + "apartment?id=";
    fetch(deleteUrl + id, {
      method: "DELETE"
    })
      .then(response => {
        let actionSuccess = {};
        if (response.ok) {
          success = true;
          console.log("Succesfully deleted!");
        } else {
          actionSuccess = { data: 'single', success: false };

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
            message: "Apartment deleted successfully!"
          });

          let allApartments = [...filteredApartments];
          let index = -1;
          allApartments.forEach((el, apartIndex) => {
            allApartments[apartIndex] = { ...el };
          });

          index = allApartments.findIndex(el =>
            el["apartment_id"] === id
          );

          allApartments.splice(index, 1);
          setFilteredApartments(allApartments);
          setApartments(allApartments);
          setCheckbox([]);
        } else {
          setOperationSuccessful({
            success: '3',
            message: "Apartment could not be deleted!"
          });
        }

      });
  }

  const removeSelectedApartments = () => {
    const deleteUrl = proxyurl + "apartment?id=";
    let allCheckboxes = [...checkboxes];
    let apartmentsToDelete = [...checkboxes];
    let allSucceed = true;

    let counter = 0;

    allCheckboxes.forEach((id, checkindex) => {
      fetch(deleteUrl + id, {
        method: "DELETE"
      })
        .then(response => {
          counter++;
          let actionSuccess = {};
          if (response.ok) {
            actionSuccess = { data: 'multi', success: true };
          } else {
            allSucceed = false;
            actionSuccess = { data: 'multi', success: false };
            let itemIndex = apartmentsToDelete.findIndex(el => el === id);
            apartmentsToDelete.splice(itemIndex, 1);
          }

        })
        .catch(() => {
          allSucceed = false;
          let itemIndex = apartmentsToDelete.findIndex(el => el === id);
          apartmentsToDelete.splice(itemIndex, 1);

          console.log("Can’t access " + deleteUrl + " response. Blocked by browser?")
        })
        .finally(() => {
          if (counter === allCheckboxes.length) {
            if (allSucceed) {
              setOperationSuccessful({
                success: '2',
                message: "Apartments deleted successfully!"
              });
            } else {
              setOperationSuccessful({
                success: '3',
                message: "Selected apartments could not be deleted!"
              });
            }
            setTimeout(() => {
              setOperationSuccessful({
                success: '1',
                message: ""
              });
            }, 4000);
            cancelDelete();
            let checkboxesToSet = [...allCheckboxes];


            let allApartments = [...filteredApartments];
            let index = -1;
            allApartments.forEach((el, apartIndex) => {
              allApartments[apartIndex] = { ...el };
            });

            for (let v = 0; v < apartmentsToDelete.length; v++) {

              index = allApartments.findIndex(el => {
                return el["apartment_id"] === +apartmentsToDelete[v]
              });
              if (index == -1)
                continue;
              allApartments.splice(index, 1);
              checkboxesToSet.splice(v, 1);
            };
            setFilteredApartments(allApartments);
            setApartments(allApartments);
            setCheckbox(checkboxesToSet);
          }
        });
    });
  };


  const makeEditable = (id) => {
    let allApartments = [...filteredApartments];

    allApartments.forEach((el, index) => {

      if (+id === +el.apartment_id) {
        allApartments[index] = { ...el };
        allApartments[index].isEditable = true
      }

    });

    setFilteredApartments(allApartments);
  }


  const saveEdit = (apartment) => {

    let allApartments = [...filteredApartments];

    let index = -1;

    allApartments.forEach((el, id) => {
      allApartments[id] = { ...el };

      if (el["apartment_id"] === +apartment.apartment_id) {
        index = id;
        apartment.owner_name = getOwnerName(apartment.owner_id)[0].name;
      }
    });

    allApartments.splice(index, 1, apartment);
    setFilteredApartments(allApartments);
  }


  const loadMore = (count) => {
    setPaginationCount(paginationCount + count);
  }


  const filterData = (e) => {
    let text = e.target.value.split(' ');
    let newItems = apartments.filter(function (item) {
      return text.every(function (el) {
        return item.address.indexOf(el) > -1 ||
          item.number.indexOf(el) > -1 ||
          item.share.toString().indexOf(el) > -1 ||
          item.area.toString().indexOf(el) > -1 ||
          item.owner_name.indexOf(el) > -1;
      });
    });
    let newCheckboxState = [];
    newItems.forEach(apartment => {
      let checkIndex = checkboxes.findIndex(checkbox => checkbox === apartment.apartment_id.toString());
      if (checkIndex > -1)
        newCheckboxState.push(apartment.apartment_id.toString())
    });
    setCheckbox(newCheckboxState);
    setFilteredApartments(newItems);
  }

  const getOwnerName = (id) => {
    return personnels.filter(el => el.personnel_id === +id);
  }

  const saveApartment = (postData, method = "POST") => {
    if (method === "POST") {
      delete postData.apartment_id;
    }

    let postAparatmentsUrl = proxyurl + "apartment";
    fetch(postAparatmentsUrl, {
      method: method,
      body: JSON.stringify(postData)
    }).then((res) => {
      if (res.status === 200) {
        if (method === "PUT") {
          setOperationSuccessful({
            success: '2',
            message: "Apartment edited successfully!"
          });
          saveEdit(postData);
        }
        else {
          setOperationSuccessful({
            success: '2',
            message: "Apartment created successfully!"
          });
          fetchData();
          setIsCreate(false);
        }
      } else {
        setOperationSuccessful({
          success: '3',
          message: "Apartment could not be created or edited!"
        });
      }

    })
      .catch((error) => {
        setOperationSuccessful({
          success: '3',
          message: "Apartment could not be created or edited!"
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



  const cancelCreation = () => {
    setIsCreate(false);
    setAction("Choose action");
  }

  const cancelEdit = (id) => {
    let allApartments = [...filteredApartments];

    allApartments.forEach((el, index) => {

      if (el.apartment_id === id) {
        allApartments[index] = { ...el };
        allApartments[index].isEditable = false;
      }
    });

    setFilteredApartments(allApartments);
    setAction("Choose action")
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
  if (filteredApartments.length > 7 * paginationCount) {
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
          removeItem={removeApartment}
          id={isDeleting.delete1}
          name="apartment" />
      }

      {isDeleting.deleteN &&
        <Remove
          cancelDelete={cancelDelete}
          removeItem={removeSelectedApartments}
          name="apartments" />
      }

      <HeaderTop menuType="Apartments" />

      <HeaderBottom
        action={action}
        totalNumber={filteredApartments.length}
        items={actions}
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
                <th style={{ minWidth: '155px' }}>Apartment No.</th>
                <th style={{ minWidth: '120px' }}>Address</th>
                <th style={{ minWidth: '127px' }}>Area, m2</th>
                <th style={{ minWidth: '100px' }}>Share, %</th>
                <th style={{ minWidth: '130px' }}>Owners name</th>
                <th style={{ minWidth: '73px' }}></th>
                <th style={{ minWidth: '73px' }}></th>
              </tr>
            </thead>
            <tbody>
              {isCreate &&
                <CreateEditApartmentFields onClick={saveApartment} onCancel={cancelCreation} personnels={personnels} />}

              {filteredApartments.slice(0, 7 * paginationCount).map(el =>
                <Apartment
                  checked={checkboxes.findIndex(chel => +chel === el.apartment_id) > -1}
                  key={el.apartment_id}
                  apartment={el}
                  onCancel={cancelEdit}
                  personnels={personnels}
                  checkboxClicked={onCheckboxClick}
                  makeEditable={makeEditable}
                  saveEdit={saveApartment}
                  showDialog={showDelete}
                />)
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

export default React.memo(Apartments);
