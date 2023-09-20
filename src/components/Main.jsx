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
    const [document, setDocument] = useState({});
    const [documentList, setDocumentList] = useState([]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
      };

    const get_document_list = async () =>{
        const response = await fetch('https://file-upload-app-ef9c62156924.herokuapp.com/document/list/', {
            method: 'GET',
            headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			},
          });
          const data = await response.json();
          setDocumentList([...data.msg.items]);

    }

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
          alert('Please select a file.');
          return;
        }
    
        const formData = new FormData();
        formData.append('document', file);
    
        try {
          const response = await fetch('https://file-upload-app-ef9c62156924.herokuapp.com/upload/document/', {
            method: 'POST',
            headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			},
            body: formData,
          });
          const data = await response.json();
          if (data && data.msg && data.msg.document) {
            setDocument(data.msg.document)
          } else {
            alert('File upload failed.');
          }
        } catch (error) {
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

        get_document_list();
      }, [document])
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
                    <p>Downloadable Link: <a href={document.file}>{document.short_url}</a></p>
                    </div>
                )}
                <h3>History</h3>
                <div className="file-upload-container">
                    <ul className="link-list">
                    {documentList.map(item=>(
                        <li key={item.id}>
                            <p><a href={item.file_path}>{item.short_url}</a> - {item.file_name}</p>
                        </li>
                    ))}
                    </ul>
                </div>


        </div>
    )

}

export default Main
