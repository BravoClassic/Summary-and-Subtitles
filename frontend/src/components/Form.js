import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const FormComponent = () => {
  const [file, setFile] = useState(null);
  const [selection, setSelection] = useState('summary');
  const [responseText, setResponseText] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('selection', selection);
    setResponseText('Uploading and Processing Audio File...');
    try {
      const response = await axios.post("http://10.25.10.186:5000/" + selection, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponseText(response.data);
    } catch (error) {
      console.log(error);
      setResponseText(error.error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file" className="formbold-form-label text-center w-100 small">Select Your Audio File</label>
        <div className="input-box">
            <input id='file' type="file" accept="audio/*" onChange={handleFileChange} />
        </div>
        <div>
          <input
            type="radio"
            id="summary"
            name="selection"
            value="summary"
            checked={selection === 'summary'}
            onChange={handleSelectionChange}
          />
          <label htmlFor="summary">Summary</label>
          <input
            type="radio"
            id="subtitle"
            name="selection"
            value="subtitle"
            checked={selection === 'subtitle'}
            onChange={handleSelectionChange}
          />
          <label htmlFor="subtitle">Sub Titles</label>
        </div>
        <button className='formbold-btn w-100' type="submit">Upload</button>
      </form>
      <div className='response'> <ReactMarkdown children={responseText} /></div>
    </div>
  );
};

export default FormComponent;
