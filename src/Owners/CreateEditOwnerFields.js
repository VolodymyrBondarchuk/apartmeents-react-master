import React, { useEffect, useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '../UI/Button';

function CreateEditOwnerFields(props) {

    const [data, setData] = useState({
        ...props.personnel
    });

    const inputChanged = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const addDataModel = () => {
        return {
            personnel_id: data['personnel_id'],
            name: data['name'],
            phone: data['phone'],
            agreement_code: data['agreement_code'],
            iin: data['iin'],
            bin: data['bin']
        }
    }


    return (
        <tr>
            <td></td>
            <td><input style={{ width: '155px' }} type="text" placeholder="Type Name" name="name" value={data.name} onChange={inputChanged} /></td>
            <td><input style={{ width: '120px' }} type="text" placeholder="Type Phone" name="phone" value={data.phone} onChange={inputChanged} /></td>
            <td><input style={{ width: '127px' }} type="text" placeholder="Set agreement" name="agreement_code" value={data.agreement_code} onChange={inputChanged} /></td>
            <td><input style={{ width: '100px' }} type="text" placeholder="Type IIN" name="iin" value={data.iin} onChange={inputChanged} /></td>
            <td><input style={{ width: '130px' }} type="text" placeholder="Type BIN" name="bin" value={data.bin} onChange={inputChanged} /></td>
            <td style={{
                textAlign: 'right'
            }}>
                <Button clicked={() => props.onClick(addDataModel(), props.method)} name="Save" fa="fa fa-save1" />
            </td>
            <td style={{
                float: 'right',
                paddingRight: 0
            }}>
                <Button clicked={() => props.onCancel(data['personnel_id'])} name="Cancel" fa="fa fa-cancel" />
            </td>
        </tr>
    );
}

export default CreateEditOwnerFields;
