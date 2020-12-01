import React, { useState } from 'react';
import classes from './Login.module.css';

const Login = (props) => {
    const [formValues, setFormValues] = useState({
        phone_number: '',
        password: ''
    });

    const valueChanged = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
    }
    return (
        <div className={classes.Login}>
            <h4>POC Invoicer Streamer</h4>
            <form onSubmit={(e) => { props.authenticate(formValues, e) }}>
                <div className={classes.Form.concat(" mt-5 p-0")}>
                    <input className={classes.Phone} type="text" name="phone_number" value={formValues.phone_number} placeholder={"логин"} onChange={valueChanged} />
                    <input className={classes.Password} type="password" name="password" value={formValues.password} placeholder={"пароль"} onChange={valueChanged} />
                </div>
                <p className={classes.Wrong}>{props.wrongData}</p>
                <input type="submit" className={classes.Submit} value="войти" />
            </form>
        </div>
    );
}

export default Login;