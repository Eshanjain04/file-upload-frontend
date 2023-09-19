import React, { useState } from 'react'
import "../CSS/signup.css";

const SignUp = () => {
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
        const response = await fetch("http://127.0.0.1:12112/user/register/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
            body:JSON.stringify({first_name,last_name,user_name,email,password})
        })

        const data = await response.json();
        console.log(data.token);

        if (data.token) {
			localStorage.setItem('token', data.token)
			alert('Account Created')
			window.location.href = '/'
		}
        else {
			alert(data.message)
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
        </div>
    </div>
  )
}

export default SignUp