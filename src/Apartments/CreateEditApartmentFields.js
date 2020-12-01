import React, { useEffect, useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '../UI/Button';

function CreateEditApartmentFields(props) {

    const [data, setData] = useState({
        apartment_id: '',
        address: '',
        share: '',
        area: '',
        number: '',
        owner_id: '',
        ...props.apartment,
        owners: [],
        selected: 1
    });

    useEffect(() => {
        setData({
            ...data,
            selected: props.apartment == undefined ? props.personnels[0].personnel_id : props.apartment.owner_id,
            owners: props.personnels
        })
    }, []);

    const inputChanged = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const selectChanged = (e) => {
        setData({
            ...data,
            selected: e.target.value
        });
    };

    const addDataModel = () => {
        return {
            apartment_id: data['apartment_id'],
            address: data['address'],
            share: +data['share'],
            area: +data['area'],
            number: data['number'],
            owner_id: +data.selected
        }
    }

    return (
        <tr>
            <td></td>
            <td><input style={{ width: '155px' }} type="text" placeholder="Number" name="number" value={data.number} onChange={inputChanged} /></td>
            <td><input style={{ width: '120px' }} type="address" placeholder="Address" name="address" value={data.address} onChange={inputChanged} /></td>
            <td><input style={{ width: '127px' }} type="number" placeholder="Area" name="area" value={data.area} onChange={inputChanged} /></td>
            <td><input style={{ width: '100px' }} type="number" placeholder="Share" name="share" value={data.share} onChange={inputChanged} /></td>
            <td>
                <select value={data.selected} onChange={selectChanged} style={{
                    padding: '5px',
                    paddingLeft: '20px!important',
                    border: '1px solid #c5dbda',
                    outline: 'none',
                    borderRadius: '4px'
                }}>
                    {data.owners.map(el =>
                        <option key={el.personnel_id} value={el.personnel_id}> {el.name}</option>)}
                </select>
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
                <Button clicked={() => props.onCancel(data['apartment_id'])} name="Cancel" fa="fa fa-cancel" />
            </td>
        </tr>
    );
}

export default React.memo(CreateEditApartmentFields);
