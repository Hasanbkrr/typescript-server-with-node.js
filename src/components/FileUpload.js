import React, { useState } from 'react';

function FileUpload({ onAddFile }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setName(selectedFile.name);
      if (selectedFile.type === 'video/mp4') {
        setType('video');
      } else if (selectedFile.type === 'image/png') {
        setType('image');
      } else {
        alert('Please select a valid video (MP4) or image (PNG) file.');
        setFile(null);
        setType("");
      }
    }
  };

  const handleAddFile = () => {
    if (file && name && duration > 0 && type) {
      const fileWithDuration = { file, duration: parseInt(duration), type, name };
      onAddFile(fileWithDuration);
      setFile(null);
      setName("");
      setDuration("");
      setType("");
    } else {
      alert('Please fill all fields correctly.');
    }
  };

  return (
    <div>
      <label htmlFor="file-upload">Select File</label>
      <input
        id="file-upload"
        type="file"
        accept="image/png,video/mp4"
        onChange={handleFileChange}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button onClick={handleAddFile} disabled={!file || !name || duration <= 0 || !type}>Add File</button>
    </div>
  );
}

export default FileUpload;
