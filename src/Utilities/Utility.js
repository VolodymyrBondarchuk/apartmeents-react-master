import React, { useEffect } from 'react';
import Button from '../UI/Button';
import CreateEditUtilityFields from './CreateEditUtilityFields';

const Utility = (props) => {
    const availableMonths = ['January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const utility = props.utility;
    let date = new Date(utility.date_stamp);
    let dateToShow = availableMonths.filter((month, index) => index === date.getMonth())[0] + " " + date.getDate() + ", " + date.getFullYear();
    utility.date_show = dateToShow;
    let rowData = (
        <tr>
            <td style={{ float: 'left' }}>
                <input
                    checked={props.checked}
                    type="checkbox"
                    name={utility.invoice_id}
                    onChange={props.checkboxClicked} />
            </td>
            <td>{utility.owner_name}</td>
            <td>{utility.apartment}</td>
            <td>{utility.date_show}</td>
            <td>{utility.amount.toFixed(2)}</td>
            <td>{utility.payment_online.toFixed(2)}</td>
            <td>{utility.payment_offline.toFixed(2)}</td>
            {/* <td>{utility.used_savings}</td> */}
            <td>{utility.payment_user_balance.toFixed(2)}</td>
            <td>{utility.total_payments.toFixed(2)}</td>
            <td>{utility.electricity_amount.toFixed(2)}</td>
            <td>{utility.cold_water_amount.toFixed(2)}</td>
            <td>{utility.heating_amount.toFixed(2)}</td>
            <td style={{
                textAlign: 'right'
            }}>
                <Button clicked={() => props.makeEditable(utility.invoice_id)} name="Edit" fa="fa fa-edit" />
            </td>
            <td style={{
                float: 'right',
                paddingRight: 0
            }}>
                <Button clicked={() => props.showDialog(utility.invoice_id)} name="Remove" fa="fa fa-trash" />
            </td>
        </tr>
    );
    if (utility.isEditable || utility.isEditableOffline) {
        rowData = (
            <CreateEditUtilityFields onClick={props.saveEdit} onCancel={props.onCancel} utility={utility} method="PUT" />
        )
    }
    return (
        <>
            {rowData}
        </>
    );
}

export default Utility;