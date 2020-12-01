import React from 'react';
import Button from '../UI/Button';
import CreateEditSOpexFields from './CreateEditSOpexFields';

const SOPEX = (props) => {
    const sopex = props.sopex;
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
    let date = new Date(sopex.date_stamp);
    let dateToShow = availableMonths.filter((month, index) => index === date.getMonth())[0] + " " + date.getDate() + ", " + date.getFullYear();
    sopex.date_stamp = dateToShow;
    let rowData = (
        <tr>
            <td style={{ float: 'left' }}>
                <input
                    checked={props.checked}
                    type="checkbox"
                    name={sopex.invoice_id}
                    onChange={props.checkboxClicked} />
            </td>
            <td>{sopex.owner_name}</td>
            <td>{sopex.number}</td>
            <td>{sopex.date_stamp}</td>
            <td>{sopex.amount.toFixed(2)}</td>
            <td>{sopex.payment_online.toFixed(2)}</td>
            <td>{sopex.payment_offline.toFixed(2)}</td>
            {/* <td>{sopex.used_savings}</td> */}
            <td>{sopex.payment_user_balance.toFixed(2)}</td>
            <td>{sopex.total_payments.toFixed(2)}</td>
            <td>{sopex.negative_balance.toFixed(2)}</td>
            <td>{sopex.positive_balance.toFixed(2)}</td>
            <td>{sopex.real_amount.toFixed(2)}</td>
            <td>{sopex.total_savings.toFixed(2)}</td>
            <td>
                {/* <Button clicked={() => props.makeEditable(sopex.invoice_id)} name="Edit" fa="fa fa-edit" /> */}
            </td>
            <td style={{
                float: 'right',
                paddingRight: 0
            }}>
                <Button clicked={() => props.showDialog(sopex.invoice_id)} name="Remove" fa="fa fa-trash" />
            </td>
        </tr>
    );
    if (sopex.isEditableFacts || sopex.isEditableOffline) {
        rowData = (
            <CreateEditSOpexFields onClick={props.saveEdit} onCancel={props.onCancel} sopex={sopex} method="PUT" />
        )
    }
    return (
        <>
            {rowData}
        </>
    );
};

export default SOPEX;