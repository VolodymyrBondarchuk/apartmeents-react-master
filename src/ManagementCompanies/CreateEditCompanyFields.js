import React, { useState } from 'react';
import Button from '../UI/Button';

const CreateEditCompanyFields = (props) => {

    const [data, setData] = useState({
        ...props.company
    });

    const inputChanged = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const addDataModel = () => {
        return {
            address: data['address'],
            bank_name: data['bank_name'],
            bik: data['bik'],
            bin: data['bin'],
            iik: data['iik'],
            knp: data['knp'],
            iin: data['iin'],
            kbe: data['kbe'],
            management_company_id: data['management_company_id'],
            name: data['name'],
            phone_number: data['phone_number'],
            rnn: data['rnn']
        }
    }



    return (
        <tr>
            <td></td>
            <td><input style={{ width: '125px' }}  type="text" placeholder="Type company name" name="name" value={data.name} onChange={inputChanged} /></td>
            <td><input style={{ width: '60px' }} type="text" placeholder="Type BIN" name="bin" style={{ width: '90px' }} value={data.bin} onChange={inputChanged} /></td>
            <td><input style={{ width: '100px' }} type="text" placeholder="Type IIN" name="iin" style={{ width: '90px' }} value={data.iin} onChange={inputChanged} /></td>
            <td><input style={{ width: '66px' }} type="text" placeholder="Type IIK" name="iik" value={data.iik} onChange={inputChanged} /></td>
            <td><input style={{ width: '57px' }} type="text" placeholder="Type KBE" name="kbe" style={{ width: '50px' }} value={data.kbe} onChange={inputChanged} /></td>
            <td><input style={{ width: '57px' }} type="text" placeholder="Type KNP" name="knp" style={{ width: '50px' }} value={data.knp} onChange={inputChanged} /></td>
            <td><input style={{ width: '57px' }} type="text" placeholder="Type bank name" name="bank_name" value={data.bank_name} onChange={inputChanged} /></td>
            <td><input style={{ width: '57px' }} type="text" placeholder="Type BIK" name="bik" style={{ width: '50px' }} value={data.bik} onChange={inputChanged} /></td>
            <td><input style={{ width: '57px' }} type="address" placeholder="Type adress" name="address" value={data.address} onChange={inputChanged} /></td>
            <td><input style={{ width: '57px' }} type="text" placeholder="Type RNN" name="rnn" value={data.rnn} onChange={inputChanged} /></td>
            <td><input style={{ width: '57px' }} type="text" placeholder="Type phone number" name="phone_number" style={{ width: '100px' }} value={data.phone_number} onChange={inputChanged} /></td>
            <td style={{
                textAlign: 'right'
            }}>
                <Button clicked={() => props.onClick(addDataModel(), props.method)} name="Save" fa="fa fa-save1" />
            </td>
            <td style={{
                float: 'right',
                paddingRight: 0
            }}>
                <Button clicked={() => props.onCancel(data['management_company_id'])} name="Cancel" fa="fa fa-cancel" />
            </td>
        </tr>
    );
}

export default CreateEditCompanyFields;