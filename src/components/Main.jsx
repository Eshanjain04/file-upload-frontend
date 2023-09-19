import React, { useState, useEffect } from 'react'
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
          const user = decodeToken(token);
          if (!user) {
            localStorage.clear();
            navigate("/signin")
          }
        }else{
          navigate("/signin")
        }
      }, [])
    return(
        <div className='main-container'>
            Main Component
        </div>
    )

}

export default Main
