import React, { useState, useEffect } from 'react'
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../CSS/Main.css';

const Main = ({baseUrl}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/signin")
        
      };

    const [file, setFile] = useState(null);
    const [document, setDocument] = useState({});
    const [documentList, setDocumentList] = useState([]);
    const [uploaded, setuploaded] = useState(false);
    const [uploadedSuccess, setuploadedSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (isValidFileType(selectedFile)) {
                setFile(selectedFile);
                setDocument({})
            } else {
              alert('Invalid file type. Please select a valid file.');
            }
          }
        
      };

    const get_document_list = async () =>{
        const response = await fetch(`${baseUrl}/document/list/`, {
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
            setuploaded(true);
          const response = await fetch(`${baseUrl}/upload/document/`, {
            method: 'POST',
            headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			},
            body: formData,
          });
          const data = await response.json();
          if (data && data.msg && data.msg.document) {
            setDocument(data.msg.document);
            setuploaded(false);
            setuploadedSuccess(true);
            setTimeout(()=>{
                setuploadedSuccess(false);
            },2000)
          } else {
            alert('File upload failed.');
          }
        } catch (error) {
          alert('An error occurred while uploading the file.');
        }
      };
      
      const isValidFileType = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']; // Add allowed file types
        return allowedTypes.includes(file.type);
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
                <h4 className="upload-header">{'Allowed File Types : PDF,JPEG,PNG,TXT,HTML'}</h4>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="file-input" className="custom-file-upload">
                    <input type="file" id="file-input" onChange={handleFileChange} />
                    Select File
                    </label>
                    <button type="submit" className="upload-button" disabled={uploaded}>
                    Upload
                    </button>
                </form>
                </div>
                 <div className='text-line'>{uploaded ? 'Please wait while we upload your file...' : ''}</div>
                 <div className='text-line'>{uploadedSuccess ? 'File Uploaded Successfully' : ''}</div>
                {file && (
                    <div className="file-details">
                    <h3>Uploaded File:</h3>
                    <p>File Name: {file.name}</p>
                    <p>File Size: {file.size} bytes</p>
                    <p>Downloadable Link: <a href={document.file}>{document.short_url}</a></p>
                    </div>
                )}
                
                <div className="file-upload-container">
                    <h3>History</h3>
                    <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>File</th>
                            <th>Link</th>
                        </tr>
                        </thead>
                    {documentList.map(item=>(
                        <tbody>
                            <tr key={item.id}>
                                <td>{item.file_name}</td>
                                <td><a href={item.file_path}>{item.short_url}</a></td>
                            </tr>
                        </tbody>
                    ))}
                </table>
                </div>
                </div>


        </div>
    )

}

export default Main
