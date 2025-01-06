import React, { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye } from '@fortawesome/free-solid-svg-icons';
import './Chat';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("password");

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/joinChat'); 
            }
        });
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Logged In');
            navigate('/joinChat');
        } catch (error) {
            alert(error.message);
        }
    };
    //New Code End

    const eyeLog = () => {
        if(type === "password"){
            setType("text")
        }else{
            setType("password")
        };

    };
    return(
        <>
         <h2 className='head'>Login</h2><hr/>
        <div>
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"></input>
            <button className='logBtn' onClick={handleLogin}>Login</button>
            <div onClick={eyeLog} className="eyeLog"><FontAwesomeIcon icon={faEye} /></div>
        </div>
        </>
    )
}

export default Login;