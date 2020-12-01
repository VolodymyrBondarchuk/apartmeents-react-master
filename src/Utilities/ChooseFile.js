import React from 'react';
import Backdrop from '../UI/Backdrop';
import classes from './CsvModal.module.css'

const ChooseFile = (props) => {
    return (
        <>
            <Backdrop cancelDelete={props.cancelUpload} />
            <div className={classes.CsvModal.concat(" shadow")}>
                <input type="file" ref={props.fileRef} onChange={props.changed} id="input" />
                <button className="mr-2 btn btn-sm btn-danger" onClick={props.cancelUpload}>Cancel</button>

            </div>
        </>
    )
}

export default ChooseFile;