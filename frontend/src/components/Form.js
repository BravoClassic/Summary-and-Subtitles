import React, { useState } from 'react';
import axios from 'axios';

const FormComponent = () => {
  const [file, setFile] = useState(null);
  // const [Url, setUrl] = useState('');
  const [selection, setSelection] = useState('summary');
  const [responseText, setResponseText] = useState('');
  // const [fileDisabled, setFileDisabled] = useState(false);
  // const [urlDisabled, setUrlDisabled] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    // if (event.target.files[0]) {
    //   setUrlDisabled(false);
    // }else{
    //   setUrlDisabled(true);
    // }
  };

  // const handleUrlChange = (event) => {
  //   setUrl(event.target.value);
  //   if (event.target.value === '') {
  //     setFileDisabled(false);
  //   }else{
  //     setFileDisabled(true);
  //   }
  // };

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    // formData.append('Url', Url);
    formData.append('selection', selection);

    try {
      const response = await axios.post("http://10.25.10.186:5000/" + selection, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      setResponseText(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlfor="file" className="formbold-form-label text-muted text-center w-100 small">Select Your Audio File</label>
        <div className="input-box">
            <input id='file' type="file" accept="audio/*" onChange={handleFileChange} /* disabled={fileDisabled} *//>
        </div>
        {/* <input type="text" className='formbold-form-input' value={Url} onChange={handleUrlChange} placeholder="YouTube Video URL" disabled={urlDisabled} /> */}
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
      {responseText && <p> {selection} {responseText}</p>}
    </div>
  );
};

export default FormComponent;
