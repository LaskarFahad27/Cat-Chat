import React, { useState, useRef } from 'react'
import './Design.css';
import './Login';
import { useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth, db} from "./Firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const OTP = () => {
    const [otp1, setOtp1] = useState("");
    const [otp2, setOtp2] = useState("");
    const [otp3, setOtp3] = useState("");
    const [otp4, setOtp4] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const name = location.state?.name;
    const email = location.state?.email;
    const password = location.state?.password;
    const number = location.state?.number;

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        if (value.length <= 1) {
            if (index === 0) setOtp1(value);
            if (index === 1) setOtp2(value);
            if (index === 2) setOtp3(value);
            if (index === 3) setOtp4(value);

            if (value.length === 1 && index < 3) {
                otpRefs[index + 1].current.focus();
            }
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
            otpRefs[index - 1].current.focus();
        }
    };


    const verify = async () => {
        const otp = `${otp1}${otp2}${otp3}${otp4}`;
        if(otp == number){
            try{
                await createUserWithEmailAndPassword(auth,email,password);
           const user = auth.currentUser;
           if(user){
            await setDoc(doc(db, "users", user.uid),{
                email: user.email,
                name: name,
            });
           }
           alert("Registered Successfully");
           navigate('/Login');
           
            }catch(error){
                alert(error.message);
            }
            
        }else{
            alert("Incorrect OTP")
            setOtp1("");
            setOtp2("");
            setOtp3("");
            setOtp4("");
        };
    };
    return(
        <>
        <div className="page">
        <div className="otpPalate">
            <h3 className='otpMsg'>Enter The OTP Sent To Your Email</h3>
            <div className="otp-container">
                        <input
                            ref={otpRefs[0]}
                            className="otp"
                            type="text"
                            value={otp1}
                            onChange={(e) => handleInputChange(e, 0)}
                            onKeyDown={(e) => handleKeyDown(e, 0)}
                            maxLength={1}
                        />
                        <input
                            ref={otpRefs[1]}
                            className="otp"
                            type="text"
                            value={otp2}
                            onChange={(e) => handleInputChange(e, 1)}
                            onKeyDown={(e) => handleKeyDown(e, 1)}
                            maxLength={1}
                        />
                        <input
                            ref={otpRefs[2]}
                            className="otp"
                            type="text"
                            value={otp3}
                            onChange={(e) => handleInputChange(e, 2)}
                            onKeyDown={(e) => handleKeyDown(e, 2)}
                            maxLength={1}
                        />
                        <input
                            ref={otpRefs[3]}
                            className="otp"
                            type="text"
                            value={otp4}
                            onChange={(e) => handleInputChange(e, 3)}
                            onKeyDown={(e) => handleKeyDown(e, 3)}
                            maxLength={1}
                        />
                    </div>
            <button className="verify"
                    onClick={verify}>Verify</button>

        </div>
        </div>
        </>
    )
}
export default OTP;