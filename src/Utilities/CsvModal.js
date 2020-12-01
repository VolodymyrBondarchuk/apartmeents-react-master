import classes from './CsvModal.module.css';
import React from 'react';
import Backdrop from '../UI/Backdrop';
import { CSVDownload, CSVLink } from 'react-csv'

const CsvModal = (props) => {
    props.isExport.data.forEach(el => {
        var currentTime = new Date(el.date_stamp);

        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var date = month + "/" + day + "/" + year;
        el.date_stamp = date;
    })
    return (
        <>
            <Backdrop cancelDelete={props.removeCsvModal}/>
            <div className={classes.CsvModal.concat(" shadow")}>
                <p>Are you sure you want to download this file?</p>
                <br />
                <button className="mr-2 btn btn-sm btn-danger" onClick={props.removeCsvModal}>Cancel</button>
                <CSVLink key={Math.random()}
                    onClick={() => {
                        props.removeCsvModal();
                    }}
                    data={props.isExport.data}
                    className="btn btn-sm btn-success"
                    headers={props.isExport.headers}
                    filename={'data.csv'}>Export</CSVLink>
            </div>
        </>
    )
}

export default CsvModal;