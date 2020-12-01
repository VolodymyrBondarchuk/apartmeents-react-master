import React from 'react';
import Button from '../UI/Button';
import CreateEditCompanyFields from './CreateEditCompanyFields';

const Company = (props) => {

    let rowData = (
        <tr style={{ wordBreak: 'break-word' }}>
             <td style={{ float: 'left' }}>
                <input
                    type="checkbox"
                    checked={props.checked}
                    name={props.company.management_company_id}
                    onChange={props.checkboxClicked} />
            </td>
            <td>{props.company.name}</td>
            <td>{props.company.bin}</td>
            <td>{props.company.iin}</td>
            <td>{props.company.iik}</td>
            <td>{props.company.kbe}</td>
            <td>{props.company.knp}</td>
            <td>{props.company.bank_name}</td>
            <td>{props.company.bik}</td>
            <td>{props.company.address}</td>
            <td>{props.company.rnn}</td>
            <td>{props.company.phone_number}</td>
            <td style={{
                textAlign: 'right'
            }}>
                <Button clicked={() => props.makeEditable(props.company.management_company_id)} name="Edit" fa="fa fa-edit" />
            </td>
            <td style={{
                float: 'right',
                paddingRight: 0
            }}>
                <Button clicked={() => props.showDialog(props.company.management_company_id)} name="Remove" fa="fa fa-trash" />
            </td>
        </tr >
    );
    if (props.edit) {
        rowData = (
            <CreateEditCompanyFields onClick={props.saveEdit} company={props.company} onCancel={props.onCancel} method="PUT" />
        )
    }
    return (
        <>
            {rowData}
        </>
    );
}

export default Company;