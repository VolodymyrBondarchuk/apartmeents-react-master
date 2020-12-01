import React, { useEffect, useState } from 'react';
import classes from './Header.module.css';
import { Multiselect } from 'multiselect-react-dropdown';
import './HeaderFilter.css';
import imgUp from '../fonts/upimage.JPG.png';
import imgDown from '../fonts/dwnimage.JPG.png';

const HeaderFilter = (props) => {
    const [clickedAp, setClickedAp] = useState(false);
    const [clickedMo, setClickedMo] = useState(false);
    const [owners, setOwners] = useState([
        {
            name: 'Ema Watson',
            checked: false,
            id: 1
        },
        {
            name: 'Sara Hurakani',
            checked: false,
            id: 2
        },
        {
            name: 'Ardian Myrtezaja',
            checked: false,
            id: 3
        },
        {
            name: 'Florian Maxhera',
            checked: false,
            id: 4
        }, ,
        {
            name: 'Blerim Vela',
            checked: false,
            id: 5
        },
        {
            name: 'Zglooh Vllasi',
            checked: false,
            id: 6
        },
        {
            name: 'Noble Ante',
            checked: false,
            id: 7
        }
    ]);


    let ownersWithId = props.owners;
    ownersWithId.forEach((el, id) => {
        ownersWithId[id] = { ...el };
        ownersWithId[id].id = id;
    });
    let allApartments = [...props.apartments];
    let apartmentsToShow = [...props.apartments];
    let chosenOwners = props.dataToFilter.chosenOwners;
    let chosenApartments = props.dataToFilter.chosenApartments;
    let ownersToShow = [...ownersWithId];

    if (chosenOwners.length > 0) {
        let newApartments = [];
        chosenOwners.forEach(owner => {
            allApartments.forEach((apartment, index) => {
                if (owner.name === apartment.owner_name) {
                    newApartments.push(apartment);
                }
            })
        });
        apartmentsToShow = newApartments;
        chosenApartments.forEach(selected => {
            if (apartmentsToShow.length > 0) {
                if (apartmentsToShow.findIndex(toShow => toShow.number === selected.number) === -1)
                    props.advancedFilter(selected.number, "Apartments", true);

            }
            else
                props.advancedFilter(selected.number, "Apartments", true)
        })
    }
    // if (chosenApartments.length > 0) {
    //     let indexOfApartment = apartmentsToShow.findIndex(el => el.number === apartmentSelected)
    //     ownersWithId.forEach((owner, index) => {
    //         if (apartmentsToShow[indexOfApartment].owner_id !== owner.personnel_id) {
    //             let indexToRemove = ownersToShow.findIndex(el => el.name === ownersWithId[index].name);
    //             ownersToShow.splice(indexToRemove, 1);
    //         }
    //     })
    // }


    return (
        <div className="row mt-2 col-12 ml-1">
            <div className=" align-self-center pr-0" style={{ width: '18%', marginRight: "2%" }}>
                <Multiselect
                    options={ownersToShow}
                    onSelect={(p1, p2) => props.advancedFilter(p2, "Owners")}
                    onRemove={(p1, p2) => props.advancedFilter(p2, "Owners", true)}
                    displayValue="name"
                    selectedValues={props.dataToFilter.chosenOwners}
                    showCheckbox={true}
                    avoidHighlightFirstOption
                    emptyRecordMsg={"No owners found"}
                    closeOnSelect={false}
                    style={{
                        chips: {
                            display: 'none',
                            background: "#cecdcd",
                            color: "#000",
                            paddingLeft: '20px'
                        },
                        searchBox: {
                            "border": "1px solid #f5e9e9",
                            borderRadius: "4px",
                            paddingLeft: '20px',
                            fontSize: '14px',
                            paddingTop: '7px',
                            paddingBottom: '6px'
                        },
                        optionListContainer: {
                            fontSize: '14px'
                        },
                        optionContainer: {
                            fontSize: '14px'
                        }
                    }}
                    id="owners"
                    placeholder={props.dataToFilter.chosenOwners.length + " owners selected"}
                />
            </div>

            <div className=" align-self-center pr-0 " style={{ width: '18%', marginRight: "2%" }}>

                <Multiselect
                    options={apartmentsToShow}
                    onSelect={(p1, p2) => props.advancedFilter(p2, "Apartments")}
                    onRemove={(p1, p2) => props.advancedFilter(p2, "Apartments", true)}
                    displayValue="number"
                    selectedValues={props.dataToFilter.chosenApartments}
                    showCheckbox={true}
                    avoidHighlightFirstOption
                    emptyRecordMsg={"No apartments found"}
                    closeOnSelect={false}
                    style={{
                        chips: {
                            display: 'none',
                            background: "#cecdcd",
                            color: "#000",
                            paddingLeft: '20px'
                        },
                        searchBox: {
                            "border": "1px solid #f5e9e9",
                            borderRadius: "4px",
                            paddingLeft: '20px',
                            fontSize: '14px',
                            paddingTop: '7px',
                            paddingBottom: '6px'
                        },
                        optionListContainer: {
                            fontSize: '14px'
                        },
                        optionContainer: {
                            fontSize: '14px'
                        }
                    }}
                    id="apartments"
                    placeholder={props.dataToFilter.chosenApartments.length + " apartments selected"}
                />

                {/* <select className={classes.inputs} value={props.dataToFilter.apartment} onBlur={() => setClickedAp(!clickedAp)} onClick={() => setClickedAp(!clickedAp)} onChange={(e) => props.advancedFilter(e.target.value, "Apartments")}
                    style={{
                        appearance: "none",
                        backgroundImage: `url(${clickedAp ? imgUp : imgDown})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "50px",
                        backgroundPosition: "right center"
                    }}>
                    <option key={'q'} value={''}>Choose apartment</option>
                    {apartmentsToShow.map((el) => <option key={el.apartment_id} value={el.number} >{el.number}</option>
                    )};
                </select> */}
            </div>
            <div className=" align-self-center pr-0 " style={{ width: '18%', marginRight: "2%" }}>
                <Multiselect
                    options={props.availableMonths}
                    onSelect={(p1, p2) => props.advancedFilter(p2, "Month")}
                    onRemove={(p1, p2) => props.advancedFilter(p2, "Month", true)}
                    selectedValues={props.dataToFilter.chosenMonths}
                    showCheckbox={true}
                    avoidHighlightFirstOption
                    emptyRecordMsg={"No month found"}
                    closeOnSelect={false}
                    displayValue="name"
                    style={{
                        chips: {
                            display: 'none',
                            background: "#cecdcd",
                            color: "#000",
                            paddingLeft: '20px'
                        },
                        searchBox: {
                            "border": "1px solid #f5e9e9",
                            borderRadius: "4px",
                            paddingLeft: '20px',
                            fontSize: '14px',
                            paddingTop: '7px',
                            paddingBottom: '6px'
                        },
                        optionListContainer: {
                            fontSize: '14px'
                        },
                        optionContainer: {
                            fontSize: '14px'
                        }
                    }}
                    id="months"
                    placeholder={props.dataToFilter.chosenMonths.length + " months selected"}
                />
                {/* <select className={classes.inputs} value={props.availableMonths[props.dataToFilter.month - 1]} onBlur={() => setClickedMo(!clickedMo)} 
                onClick={() => setClickedMo(!clickedMo)} onChange={(e) => props.advancedFilter(e.target.value, "Month")}
                    style={{
                        appearance: "none",
                        backgroundImage: `url(${clickedMo ? imgUp : imgDown})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "50px",
                        backgroundPosition: "right center"
                    }}>
                    {props.availableMonths.map((el) => <option key={el} value={el} >{el}</option>
                    )};
                </select> */}

            </div>
            <div className="align-self-center pr-0 " style={{ width: '18%', marginRight: "2%" }}>
                <input
                    type="number"
                    value={props.dataToFilter.year}
                    className={classes.inputs}
                    onChange={(e) => props.advancedFilter(e, "Year")}
                    placeholder="Year" />

            </div>
            {/* BUTTONS TO CLEAR FILTERS AND ADD THEM */}
            <div style={{ width: '9%', marginRight: "2%" }}>
                <button className={classes.filterButton} onClick={() => props.setAdvancedFilterUtilities(true)} >Reset filter</button>
            </div>
            <div style={{ width: '9%' }}>
                <button className={classes.filterButton} onClick={() => props.setAdvancedFilterUtilities(false)} >Use filter</button>
            </div>
        </div>
    );

}

export default HeaderFilter;