import React, { useState } from 'react';
import { useHistory } from 'react-router';
import classes from './Header.module.css';
import imgUp from '../fonts/upimage.JPG.png';
import imgDown from '../fonts/dwnimage.JPG.png';
import userIcon from '../fonts/profile-user.png';

const HeaderTop = (props) => {
    let history = useHistory();
    const [clicked, setClicked] = useState(false);

    const [menu, setMenu] = useState({
        menuItems: [
            {
                path: 'apartments',
                value: "Apartments"
            },
            {
                path: "owners",
                value: "Owners"
            },
            {
                path: "opex",
                value: "OPEX"
            },
            {
                path: "utilities",
                value: "Utilities"
            },
            {
                path: "management",
                value: "Management company"
            }],
        selected: props.menuType
    });

    const changeMenu = (e) => {
        setMenu({
            ...menu,
            selected: e.target.value
        });

        let index = menu.menuItems.findIndex(el => el.value === e.target.value);

        history.push("/" + menu.menuItems[index].path)
    }

    const onLogOut = () => {
        localStorage.removeItem("isAuthenticated");
        window.location.href = "/login";
    }
    return (
        <div className="row col-12 ml-1 mb-5 pr-4">
            <div className=" mb-2 mb-md-0" style={{ width: '50%', textAlign: "left" }}>
                <h6>POC Invoice Streamer</h6>
            </div>
            <div className="mb-2 mb-md-0" style={{ width: '50%', textAlign: "end" }}>
                <button className={classes.filterButton} onClick={onLogOut} style={{
                    width: '135px',
                    marginRight: '27px'
                }}>Log out</button>
                <select value={menu.selected} className={classes.menuInput}
                    onBlur={() => {
                        if (clicked)
                            setClicked(!clicked)
                    }}
                    onClick={() => setClicked(!clicked)}
                    onChange={changeMenu}
                    style={{
                        appearance: "none",
                        backgroundImage: ``,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "50px",
                        backgroundPosition: "right center"
                    }}>
                    {menu.menuItems.map(el => {
                        return <option
                            key={el.value}
                            value={el.value}>{el.value}</option>
                    })}
                </select>
            </div>

        </div >
    );
}

export default React.memo(HeaderTop);