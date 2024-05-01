import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const FormComponent = () => {
  const [file, setFile] = useState(null);
  const [Url, setUrl] = useState('');
  const [selection, setSelection] = useState('summary');
  const [responseText, setResponseText] = useState('');
  const [fileDisabled, setFileDisabled] = useState(false);
  const [urlDisabled, setUrlDisabled] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if (event.target.files[0]) {
      setUrlDisabled(false);
    }else{
      setUrlDisabled(true);
    }
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    if (event.target.value === '') {
      setFileDisabled(false);
    }else{
      setFileDisabled(true);
    }
  };

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };


  // ffmpeg initialization
  const [ffmpeg, setFfmpeg] = useState(null);

  useEffect(() => {
    const createFfmpegInstance = async () => {
      const ffmpegInstance = await createFFmpeg();
      await ffmpegInstance.load(); // Load ffmpeg.wasm resources
      setFfmpeg(ffmpegInstance);
    };

    createFfmpegInstance();
  }, []);

  const pocess_file = async (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const supportedAudioExtensions = ['mp3', 'wav', 'ogg'];
    if (supportedAudioExtensions.includes(fileExtension)) {
      // Return audio file
      return file;
    } else {
      // Convert video to audio
      try {
        const video = await ffmpeg.FS.readFile(file.name, 'binary');
    
        const audioBlob = await ffmpeg.run({
          // Video to audio conversion options (similar to previous example)
          inputs: [{ data: video, format: 'webm' }],
          outputs: [
            {
              format: 'mp3',
              audioCodec: 'libmp3lame',
            },
          ],
        });
    
        // Create an audio element to hold the converted audio
        const audio = new Audio();
        audio.src = URL.createObjectURL(audioBlob);
    
        return audio;
      } catch (error) {

        // Handle conversion error
        console.error('Failed converting video to audio:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const audio = pocess_file(file);
    formData.append('file', file);

    formData.append('Url', Url);
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
        <label for="file" class="formbold-form-label text-muted small">Audio or Video File</label>
        <div class="input-box">
            <input id='file' type="file" accept="audio/*,video/*" onChange={handleFileChange} disabled={fileDisabled} />
        </div>
        <input type="text" className='formbold-form-input' value={Url} onChange={handleUrlChange} placeholder="YouTube Video URL" disabled={urlDisabled} />
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
