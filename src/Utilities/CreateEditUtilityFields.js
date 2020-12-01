import React, { useEffect, useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '../UI/Button';

function CreateEditUtilityFields(props) {

    const [data, setData] = useState({
        ...props.utility
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
                utilities_invoice_id: +data['invoice_id'],
                cold_water_amount: +data['cold_water_amount'],
                electricity_amount: +data['electricity_amount'],
                heating_amount: +data['heating_amount'],
                "date_stamp": data.date_stamp
            }
        }
        return postData;
        // return {
        //     utilities_invoice_id: +data['invoice_id'],
        //     cold_water_amount: +data['cold_water_amount'],
        //     electricity_amount: +data['electricity_amount'],
        //     heating_amount: +data['heating_amount'],
        //     "online_pay": data.payment_online,
        //     "offline_pay": data.payment_offline,
        //     "user_balance_pay": data.payment_user_balance
        // }
    }

    return (
        <tr>
            <td></td>
            <td>{data.owner_name}</td>
            <td>{data.apartment} </td>
            <td>{data.date_show}</td>
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
            <td>
                {data.isEditableOffline ? data.electricity_amount.toFixed(2)
                    : <input type="number" style={{ width: '57px' }} placeholder="Type electricity" name="electricity_amount" value={data.electricity_amount} onChange={inputChanged} />
                }
            </td>
            <td>
                {data.isEditableOffline ? data.cold_water_amount.toFixed(2) :
                    <input type="number" style={{ width: '57px' }} placeholder="Type cold water" name="cold_water_amount" value={data.cold_water_amount} onChange={inputChanged} />
                }</td>
            <td>
                {data.isEditableOffline ? data.heating_amount.toFixed(2) :
                    <input type="number" style={{ width: '57px' }} placeholder="Type heating" name="heating_amount" value={data.heating_amount} onChange={inputChanged} />
                }
            </td>
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

export default CreateEditUtilityFields;
