import React from 'react';
import classes from './ActionResponse.module.css';

const ActionResponse = (props) => {

    return (
        <div className={classes.ActionResponse.concat(" row justify-content-center")}>
            <div className="align-self-center">
                <button className={"btn btn-sm p-2 ".concat(props.class)}> {props.text}</button>
            </div>
        </div>
    )
}

export default ActionResponse;