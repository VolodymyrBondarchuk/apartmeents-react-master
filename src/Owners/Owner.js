import React from 'react';
import Button from '../UI/Button';
import CreateEditOwnerFields from './CreateEditOwnerFields';

const Owner = (props) => {
    let rowData = (
        <tr>
            <td style={{ float: 'left' }}>
                <input
                    type="checkbox"
                    checked={props.checked}
                    name={props.personnel.personnel_id}
                    onClick={props.checkboxClicked} />
            </td>
            <td>{props.personnel.name}</td>
            <td>{props.personnel.phone}</td>
            <td>{props.personnel.agreement_code}</td>
            <td>{props.personnel.iin}</td>
            <td>{props.personnel.bin}</td>
            <td style={{
                textAlign: 'right'
            }}>
                <Button clicked={() => props.makeEditable(props.personnel.personnel_id)} name="Edit" fa="fa fa-edit" />
            </td>
            <td style={{
                float: 'right',
                paddingRight: 0
            }}>
                <Button clicked={() => props.showDialog(props.personnel.personnel_id)} name="Remove" fa="fa fa-trash" />
            </td>
        </tr>
    );
    if (props.edit) {
        rowData = (
            <CreateEditOwnerFields onClick={props.saveEdit} personnel={props.personnel} onCancel={props.onCancel} method="PUT" />
        )
    }
    return (
        <>
            {rowData}
        </>
    );
}

export default React.memo(Owner);