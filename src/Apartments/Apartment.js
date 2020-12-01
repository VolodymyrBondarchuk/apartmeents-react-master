import React, { useEffect } from 'react';
import CreateEditApartmentFields from './CreateEditApartmentFields';
import classes from '../Headers/Header.module.css';
import Button from '../UI/Button';

const Apartment = (props) => {
    const apartment = props.apartment;
    let rowData = (
        <tr>
            <td style={{ float: 'left' }}>
                <input
                    type="checkbox"
                    checked={props.checked}
                    name={apartment.apartment_id}
                    onChange={props.checkboxClicked} />
            </td>
            <td>{apartment.number}</td>
            <td>{apartment.address}</td>
            <td>{apartment.area}</td>
            <td>{apartment.share}</td>
            <td>{apartment.owner_name}</td>
            <td style={{
                textAlign: 'right'
            }}>
                <Button clicked={() => props.makeEditable(apartment.apartment_id)} name="Edit" fa="fa fa-edit" />
            </td>
            <td style={{
                float: 'right',
                paddingRight: 0
            }}>
                <Button clicked={() => props.showDialog(apartment.apartment_id)} name="Remove" fa="fa fa-trash" />
            </td>
        </tr>
    );
    if (apartment.isEditable) {
        rowData = (
            <CreateEditApartmentFields onClick={props.saveEdit} onCancel={props.onCancel} apartment={apartment} personnels={props.personnels} method="PUT" />
        )
    }
    return (
        <>
            {rowData}
        </>
    );
}

export default Apartment;