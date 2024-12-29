import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock,  faEnvelope,faEye} from '@fortawesome/free-solid-svg-icons';
import { otp } from './OTP_Api';
import './OTP';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("password");
    const [passWarn, setPassWarn] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        if (name && email && password.length >= 6) {
            const number =  Math.floor(1000 + Math.random() * 9000);
            navigate('/OTP', { state: {name, email, password, number} });
            setName("");
            setEmail("");
            setPassword("");
            await otp(email, number, name);
        } else {
            alert("Something Went Wrong");
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (value.length < 6) {
            setPassWarn("Password must be at least 6 characters long.");
        } else {
            setPassWarn("");
        }
    };
   
    const handleEye = () => {
        if(type === "password"){
            setType("text")
        }else{
            setType("password")
        };

    };

    return(
        <>
        <h2 className='head'>Register</h2><hr/>
        <div>
            <div className="user"><FontAwesomeIcon icon={faUser} /></div>
            <input className="name" 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"></input>
            <div className="user"><FontAwesomeIcon icon={faEnvelope} /></div>
            <input className="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"></input>
            <div className="user"><FontAwesomeIcon icon={faLock} /></div>
            <input className="pass" 
            type={type} 
            value={password}
            onChange= {handlePasswordChange}
            placeholder="Enter Password"></input>
            <div onClick={handleEye} className="eyeReg"><FontAwesomeIcon icon={faEye} /></div>
        </div>
        <div className="passWarn">{passWarn}</div>
        <button className='regBtn' onClick={handleRegister}>Register</button>
        </>
    )
}

export default Register;      