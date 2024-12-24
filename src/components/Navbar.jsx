import './Design.css'
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from './images/logo.png';

const Navbar = ({content}) => {

    const location = useLocation(); 
    const linksClass = location.pathname === '/' 
        ? 'links linkRight' 
        : location.pathname === '/login' 
        ? 'links linkLeft' 
        : 'links';
    const inputsClass = location.pathname === '/' 
        ? 'inputs inputsLeft' 
        : location.pathname === '/login' 
        ? 'inputs inputsRight' 
        : 'inputs';
    const linksResClass = location.pathname === '/' 
        ? 'reslinks linkUp' 
        : location.pathname === '/login' 
        ? 'reslinks linkDown' 
        : 'reslinks';
        const inputsResClass = location.pathname === '/' 
        ? 'resinputs inputsDown' 
        : location.pathname === '/login' 
        ? 'resinputs inputsUp' 
        : 'resinputs';    
    return (
        <div className="page">
        <div className="container">

        <div className={linksResClass}> 
           <div className='logoBox'>
                    <img className='logo' src={logo}/>
                    <span>Cat Chat</span>
           </div>
           <pre>Stay Connected With Us<br></br>
                    And Explore Yourself</pre>
                <NavLink className={(e)=>{return e.isActive?"actv":"inactv"}} to='/'>Register</NavLink>
                <NavLink className={(e)=>{return e.isActive?"actv":"inactv"}} to='/login'>Login</NavLink>

        </div>
            <div className={inputsResClass}>{content}</div>
            <div className={inputsClass}>{content}</div>
            <nav className={linksClass}>
                <div className='logoBox'>
                    <img className='logo' src={logo}/>
                    <span>Cat Chat</span>
                </div>
                <pre>Stay Connected With Us<br></br>
                    And Explore Yourself</pre>
                <NavLink className={(e)=>{return e.isActive?"actv":"inactv"}} to='/'>Register</NavLink>
                <NavLink className={(e)=>{return e.isActive?"actv":"inactv"}} to='/login'>Login</NavLink>
            </nav>
        </div>
        </div>
    );
};

export default Navbar;