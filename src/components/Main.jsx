import React, { useState, useEffect } from 'react'
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../CSS/Main.css';

const Main = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/signin")
        
      };

    const [file, setFile] = useState(null);
    const [document, setDocument] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
          alert('Please select a file.');
          return;
        }
    
        const formData = new FormData();
        formData.append('document', file);
    
        try {
          const response = await fetch('http://127.0.0.1:12112/upload/document/', {
            method: 'POST',
            headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			},
            body: formData,
          });
          const data = await response.json();
          if (data && data.msg && data.msg.document) {
            console.log(data.msg.document.file);
            setDocument(data.msg.document.file)
          } else {
            alert('File upload failed.');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('An error occurred while uploading the file.');
        }
      };

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
            <Header onLogout={handleLogout}/>
            <div className="file-upload-container">
                <h2 className="upload-header">Upload a File</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="file-input" className="custom-file-upload">
                    <input type="file" id="file-input" onChange={handleFileChange} />
                    Select File
                    </label>
                    <button type="submit" className="upload-button">
                    Upload
                    </button>
                </form>
                </div>
                {file && (
                    <div className="file-details">
                    <h3>Uploaded File:</h3>
                    <p>File Name: {file.name}</p>
                    <p>File Size: {file.size} bytes</p>
                    <p>Downloadable Link: <a href={document}>{document}</a></p>
                    </div>
                )}
        </div>
    )

}

export default Main
