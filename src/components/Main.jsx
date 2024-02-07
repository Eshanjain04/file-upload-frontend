import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../CSS/Main.css';
import { Audio } from 'react-loader-spinner'

const Main = ({baseUrl}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/signin")
        
      };

    const [file, setFile] = useState(null);
    const [document, setDocument] = useState({});
    const [documentList, setDocumentList] = useState([]);
    const [uploaded, setuploaded] = useState(false);
    const [uploadedSuccess, setuploadedSuccess] = useState(false);
    const [deleted, setdeleted] = useState(false);
    const [deleteSuccess, setdeleteSuccess] = useState(false);

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
				        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
			      },
          });
          const data = await response.json();
          setDocumentList([...data.msg.items]);
          setdeleteSuccess(false);

    }

    const handleDelete = async(item)=>{
      setdeleted(true);
      let item_id = item._id.$oid
      const response = await fetch(`${baseUrl}/document/${item_id}/delete/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data['msg'] && data['msg']['status'] && data['msg']['status'] === 'success'){
        setdeleted(false);
        setdeleteSuccess(true);
        setTimeout(()=>{
          setdeleteSuccess(false);
      },2000)
      }
      else{
        alert('Error occured while deleting file')
      }

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
				'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
			},
            body: formData,
          });
          const data = await response.json();
          if (data && data.msg && data.msg.document) {
            setDocument(data.msg.document);
            setuploaded(false);
            setdeleteSuccess(false);
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
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'application/pdf',
          'text/plain',
          'application/json',
          'application/csv',
          'application/zip',
          'application/html',
        ]; // Add allowed file types
        return allowedTypes.includes(file.type);
      };

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (!token) {
            sessionStorage.clear();
            navigate("/signin")
        }else{
          get_document_list();
        }

      }, [document,deleteSuccess])
    return(
        <div className='main-container'>
            <Header onLogout={handleLogout}/>
            <div className="file-upload-container">
                <h2 className="upload-header">Upload a File</h2>
                <h4 className="upload-header">{'Allowed File Types : PDF,JPG,JPEG,PNG,TXT,HTML,CSV'}</h4>
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
                 <div className='text-line'>{deleted ? 'Please wait while we delete your file...' : ''}</div>
                 <div className='text-line'>{deleteSuccess ? 'File Deleted Successfully' : ''}</div>
    
                <div className="file-upload-container">
                    <h3>History</h3>
                    <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>File</th>
                            <th>Link</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                    {documentList.map(item=>(
                        <tbody>
                            <tr key={item.id}>
                                <td>{item.file_name}</td>
                                <td><a href={item.file_path}>{item.short_url}</a></td>
                                <td><button type="submit" className="upload-button" onClick={()=>{handleDelete(item)}}>Delete</button></td>
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
