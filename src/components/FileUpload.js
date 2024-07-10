import React, { useState } from 'react';

function FileUpload({ onAddFile }) {
  const [file, setFile] = useState(null); // Seçilen dosyayı saklamak için state
  const [name, setName] = useState(""); // Dosya ismini saklamak için state
  const [duration, setDuration] = useState(0); // Video süresini saklamak için state
  const [type, setType] = useState("image"); // Dosya türünü saklamak için state (varsayılan olarak "image")

  // Dosya seçildiğinde çağrılan fonksiyon
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        setType('video');
      } else if (selectedFile.type.startsWith('image/')) {
        setType('image');
      } else {
        alert('Please select a valid video or image file.'); // Geçerli bir dosya değilse uyarı
        setFile(null);
        setType("image");
      }
    }
  };

  // Dosyayı yüklemek için çağrılan fonksiyon
  const handleAddFile = () => {
    if (file) {
      const fileSrc = URL.createObjectURL(file); // Dosya URL'si oluştur
      onAddFile({
        name,
        src: fileSrc,
        nth: 0,
        duration: parseInt(duration),
        type
      });  // Dosyayı üst bileşene (App) ekle
      setFile(null);
      setName("");
      setDuration(0);
      setType("image");
    } else {
      alert('Please select a file.');  // Dosya seçilmemişse uyarı
    }
  };

  return (
    <div>
      <label htmlFor="file-upload">Select File</label>
      <input
        id="file-upload"
        type="file"
        accept="image/*,video/*"  // Sadece resim ve video dosyalarına izin ver
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
      <button onClick={handleAddFile} disabled={!file || !name || !duration}>Add File</button>  {/* Dosya ekleme butonu */}
    </div>
  );
}

export default FileUpload;
