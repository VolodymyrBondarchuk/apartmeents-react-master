import React from 'react';
import classes from './Button.module.css';

const Button = (props) => {
    return (
        <button
            className={classes.default}
            onClick={() => props.clicked()} >
            <span>{props.name}</span><i className={props.fa.concat(" "+classes.fonta)} aria-hidden="true"></i>
        </button>
    );
}

export default Button;