import React from 'react'
import '../CSS/header.css';

export default function Header({ onLogout }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="./logo512.png" alt="Logo"/>
        <div>Welcome {localStorage.getItem('user_name')}</div>
      </div>
      <div className="logout-button">
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  )
}
