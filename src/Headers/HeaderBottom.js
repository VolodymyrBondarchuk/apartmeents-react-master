import React, { useState } from 'react';
import classes from './Header.module.css';
import './HeaderFilter.css';


const HeaderBottom = (props) => {
    const [clicked, setClicked] = useState(false);
    return (
        <div className="row mt-4 col-12 ml-1 pr-4" style={{ fontSize: '14px' }}>
            <div className=" align-self-center pr-0" style={{ width: '15%', marginRight: "2%" }}>
                <select 
                    value={props.action} 
                    className={classes.inputs}
                    onBlur={() => {
                        if (clicked)
                            setClicked(!clicked)
                    }}
                    onClick={() => setClicked(!clicked)}
                    onChange={e => props.onChange(e)} 
                    style={{
                        appearance: "none",
                        backgroundImage: ``,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "50px",
                        backgroundPosition: "right center"
                    }}>
                    
                    {props.items.map(el => <option key={el} value={el}>{el}</option>)}
                </select>
            </div>
            <div className=" align-self-center pr-0" style={{ width: '15%', marginRight: "2%" }}>
                <input type="text" placeholder={props.type ? "Search apartment" : "Search"} className={classes.inputs} onChange={(e) => props.filterData(e, "apartment")} />
            </div>
            { props.type &&
                <>
                    <div className=" align-self-center pr-0" style={{ width: '15%', marginRight: "2%" }}>
                        <input type="text" placeholder="Search owner" className={classes.inputs} onChange={(e) => props.filterData(e, "owner_name")} />
                    </div>
                    <div className=" align-self-center pr-0" style={{ width: '15%', marginRight: "2%" }}>
                        <input type="text" placeholder="Search year" className={classes.inputs} onChange={(e) => props.filterData(e, "date_stamp")} />
                    </div>
                </>
            }
            <div className="d-flex justify-content-end" style={{ width: props.type ? '32%' : "66%" }}>
                <div style={{ marginRight: "15px", width: "182px", border: '1px solid rgb(245, 233, 233)', borderRadius: '4px' }}>
                    <div className=" pt-2 pb-2" style={{ width: '95px', display: "inline-block" }}>
                        Total objects
                    </div>
                    <div style={{ width: '65px', display: "inline-block", borderRadius: '4px', height: '100%', paddingTop: '10px' }}>
                        {props.totalNumber}
                    </div>
                </div>
                <div style={{ width:  "182px", border: '1px solid rgb(245, 233, 233)', borderRadius: '4px' }}>
                    <div className="pt-2 pb-2" style={{ width: '95px', display: "inline-block" }}>
                        Choosen
                    </div>
                    <div style={{ width: '65px', display: "inline-block", borderRadius: '4px', height: '100%', paddingTop: '10px' }}>
                        {props.choosen}
                    </div>
                </div>
            </div>
        </div >
    );
}
export default React.memo(HeaderBottom);
