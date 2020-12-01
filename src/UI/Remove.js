import React from 'react';
import Backdrop from './Backdrop';
import classes from './Remove.module.css';

const Remove = (props) => { 
    return (
        <>
            <Backdrop cancelDelete={props.cancelDelete} />
            <div className={classes.Remove.concat(" shadow")}>
                <p>Are you sure you want to delete {props.name}?</p>
                <br />
                <button className="mr-2 btn btn-sm btn-danger" onClick={props.cancelDelete}>Cancel</button>
                <button className="btn btn-sm btn-success" onClick={() => props.removeItem(props.id)}>Remove</button>

            </div>
        </>
    );
}

export default Remove;