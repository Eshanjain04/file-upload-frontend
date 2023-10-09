import React, { useState } from 'react'
import "../CSS/signup.css";
import { Link } from 'react-router-dom';

const SignUp = ({baseUrl}) => {
    const[first_name ,setFirstName] = useState("");
    const[last_name ,setLastName] = useState("");
    const[user_name ,setUserName] = useState("");
    const[email ,setemail] = useState("");
    const[password ,setPassword] = useState("");
    const[cnfPassword ,setCnfPassword] = useState("");

    const loginUser = async (e)=>{
        e.preventDefault();
        if(password !== cnfPassword){
            alert('Password does not match')
        }
        const url = `${baseUrl}/user/register/`;
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
            body:JSON.stringify({first_name,last_name,user_name,email,password})
        })

        const data = await response.json();
        if (data.msg.status !== 'failed') {
			alert('Account Created')
			window.location.href = '/signin'
		}
        else {
			alert(data.msg.msg)
		}
    }
  return (
    <div className='login-main-container'>
        <h1>Logo</h1>
        <p>Create new account</p>
        <div className='login-container'>
            <form method="post">
                <input onChange={(e)=>setFirstName(e.target.value)} type="text" name="first_name" id="first_name" placeholder='First name'/>
                <input onChange={(e)=>setLastName(e.target.value)} type="text" name="last_name" id="last_name" placeholder='Last name'/>
                <input onChange={(e)=>setUserName(e.target.value)} type="text" name="user_name" id="user_name" placeholder='Username'/>
                <input onChange={(e)=>setemail(e.target.value)} type="email" name="mailid" id="mailid" placeholder='Email id'/>
                <input  onChange={(e)=>setPassword(e.target.value)} type="password" name="password" id="password" placeholder='Password'/>
                <input  onChange={(e)=>setCnfPassword(e.target.value)} type="password" name="password" id="password" placeholder='Confirm Password'/>

                <button className='signup-btn' onClick={loginUser}>Sign Up</button>
            </form>
             <Link className='signup-link' to="/signin">Click here to Sign in</Link>

        </div>

    </div>
  )
}

export default SignUp