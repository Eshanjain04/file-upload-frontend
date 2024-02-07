import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "../CSS/signin.css";

const SignIn = ({baseUrl}) => {
    const[user_name ,setusername] = useState("");
    const[password ,setPassword] = useState("");
    const loginUser = async (e)=>{
        e.preventDefault();
        const response = await fetch(`${baseUrl}/user/login/`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
            body:JSON.stringify({user_name,password})

        })
        const data = await response.json();

        if (data.msg.token) {
			sessionStorage.setItem('token', data.msg.token);
			sessionStorage.setItem('user_name', data.msg.user.user_name)

			alert(`Welcome ${data.msg.user.user_name}`)
			window.location.href = '/'
		} else {
			alert(data.msg)
		}
    }
  return (
    <div className='login-main-container'>
        <h1>Logo</h1>
        <p>Enter your credentials to access your account</p>
        <div className='login-container'>
            <form method="post">
                <input onChange={(e)=>setusername(e.target.value)} type="text" name="user_name" id="user_name" placeholder='User ID'/>
                <input  onChange={(e)=>setPassword(e.target.value)} type="password" name="password" id="password" placeholder='Password'/>
                <button onClick={loginUser}>Sign In</button>
            </form>
            <Link className='signup-link' to="/signup">Create a new account</Link>
        </div>
    </div>
  )
}

export default SignIn