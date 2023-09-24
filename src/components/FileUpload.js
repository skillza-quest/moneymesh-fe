import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:3001/investors/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .catch((error) => {
        console.log("Full Error: ", error);
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button className="btn btn-primary" onClick={onUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
