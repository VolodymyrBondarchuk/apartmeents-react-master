import React, { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '../UI/Button';

function CreateEditSOpexFields(props) {

    const [data, setData] = useState({
        ...props.sopex
    });

    const inputChanged = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const addDataModel = () => {
        let postData = {};
        if (data.isEditableOffline) {
            postData = {
                invoice_id: +data.invoice_id,
                "online_pay": +data.payment_online,
                "offline_pay": +data.payment_offline,
                "user_balance_pay": +data.payment_user_balance,
                "offline_edit": "offline"
            }
        } else {
            postData = {
                apartment_id: +data.apartment_id,
                invoice_id: +data.invoice_id,
                real_amount: +data['real_amount'],
                amount: +data.amount,
                "offline_pay": +data.payment_offline
            }
        }
        return postData;
    }

    //let total_savings = data.real_amount ? data.total_payments - data.real_amount : 0;
    return (
        <tr>
            <td></td>
            <td>{data.owner_name}</td>
            <td>{data.number} </td>
            <td>{data.date_stamp}</td>
            <td>{data.amount.toFixed(2)}</td>
            <td>{data.payment_online.toFixed(2)}</td>
            <td>
                {data.isEditableOffline ? <input type="number" style={{ width: '57px' }} placeholder="Type offline" name="payment_offline" value={data.payment_offline} onChange={inputChanged} />
                    : data.payment_offline.toFixed(2)
                }
            </td>
            {/* <td>{data.used_savings}</td> */}
            <td>{data.payment_user_balance.toFixed(2)}</td>
            <td>{data.total_payments.toFixed(2)}</td>
            <td>{data.negative_balance.toFixed(2)}</td>
            <td>{data.positive_balance.toFixed(2)}</td>
            <td >
                {data.isEditableFacts ? <input type="number" style={{ width: '57px' }} placeholder="Type real amount" name="real_amount" value={data.real_amount} onChange={inputChanged} />
                    : data.real_amount.toFixed(2)
                }
            </td>
            <td>{data.total_savings.toFixed(2)}</td>
            <td style={{
                textAlign: 'right'
            }}>
                <Button clicked={() => props.onClick(addDataModel(), props.method)} name="Save" fa="fa fa-save1" />
            </td>
            <td style={{
                float: 'right',
                paddingRight: 0
            }}>
                <Button clicked={() => props.onCancel(data['invoice_id'])} name="Cancel" fa="fa fa-cancel" />
            </td>
        </tr>
    );
}

export default CreateEditSOpexFields;
