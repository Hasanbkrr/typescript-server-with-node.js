import React, { useState, useEffect, useRef } from 'react';
import FileUpload from './components/FileUpload';
import './index.css';

function App() {
  const [objects, setObjects] = useState([]); // Yüklenen dosyaları saklamak için state
  const [currentIndex, setCurrentIndex] = useState(0); // Şu anda gösterilen dosyanın indexi
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false); // Video tam ekran modunda mı?
  const videoRef = useRef(null); // Video elementine erişim sağlamak için ref

  // objects state'inde bir değişiklik olduğunda çalışacak olan useEffect kancası
  useEffect(() => {
    if (objects.length === 0) return; // Eğer objects dizisi boşsa, hiçbir şey yapma

    const currentObject = objects[currentIndex]; // Şu anki objeyi belirleyin
    let timeoutId;

    // Nesneler arasında geçiş yapmak için bir fonksiyon
    const goToNextObject = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % objects.length); // Bir sonraki objeye geç
    };

    if (currentObject.type === 'video') { // Eğer mevcut obje bir video ise
      videoRef.current.currentTime = 0; // Videoyu başa sar
      videoRef.current.play(); // Videoyu oynat
      timeoutId = setTimeout(goToNextObject, currentObject.duration * 1000); // Belirtilen süre kadar bekle ve sonraki objeye geç
    } else {
      timeoutId = setTimeout(goToNextObject, currentObject.duration * 1000); // Eğer resimse belirtilen süre kadar bekle ve sonraki objeye geç
    }

    return () => clearTimeout(timeoutId); // Component unmount olduğunda timeout'ı temizle
  }, [currentIndex, objects]);

  // Yeni bir dosya eklendiğinde çağrılan fonksiyon
  const addFile = (file) => {
    setObjects([...objects, { ...file, nth: objects.length }]); // Yüklenen dosyayı objects dizisine ekleyin
  };

  // Video tam ekran moduna geçiş yapmak için toggle fonksiyonu
  const toggleVideoFullScreen = () => {
    const fullscreen = !isVideoFullScreen;
    if (window.electron && window.electron.toggleFullScreen) {
      window.electron.toggleFullScreen(fullscreen); // Electron API'sı kullanarak tam ekran modu aç/kapat
      setIsVideoFullScreen(fullscreen);
    } else {
      console.error('Electron API is not available');
    }
  };

  return (
    <div className="App">
      <FileUpload onAddFile={addFile} /> {/* Dosya yükleme bileşeni */}
      {objects.length > 0 && (
        <div>
          {objects[currentIndex].type === "image" ? (
            <img src={objects[currentIndex].src} alt={objects[currentIndex].name} />  /* Resim gösterme */
          ) : (
            <div>
              <video
                ref={videoRef}
                src={objects[currentIndex].src}
                onEnded={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % objects.length)}  /* Video bittiğinde bir sonraki objeye geç */
                autoPlay
                controls
              />
              <button className="fullscreen-button" onClick={toggleVideoFullScreen}>
                {isVideoFullScreen ? "Exit Full Screen" : "Enter Full Screen"}  {/* Tam ekran butonu */}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
