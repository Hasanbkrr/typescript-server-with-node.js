import React, { useState, useEffect, useRef } from 'react';
import FileUpload from './components/FileUpload';
import './index.css';

function App() {
  // State'ler
  const [objects, setObjects] = useState([]); // Yüklenen dosyaları saklamak için state
  const [currentIndex, setCurrentIndex] = useState(0); // Şu anda gösterilen dosyanın indexi
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false); // Video tam ekran modunda mı?
  const videoRef = useRef(null); // Video elementine erişim sağlamak için ref
  const timeoutRef = useRef(null); // Zaman aşımı ID'sini saklamak için ref

  // objects state'inde bir değişiklik olduğunda çalışacak olan useEffect kancası
  useEffect(() => {
    // Eğer objects dizisi boşsa, hiçbir şey yapma
    if (objects.length === 0) return;

    const currentObject = objects[currentIndex]; // Şu anki objeyi belirleyin

    // Videoyu baştan oynatmak için bir fonksiyon
    const playVideo = () => {
      videoRef.current.currentTime = 0; // Videoyu başa sar
      videoRef.current.play(); // Videoyu oynat
      timeoutRef.current = setTimeout(() => {
        // Eğer sadece tek bir video varsa, videoyu tekrar oynat
        if (objects.length === 1) {
          playVideo();
        } else {
          // Birden fazla obje varsa, bir sonraki objeye geç
          setCurrentIndex((prevIndex) => (prevIndex + 1) % objects.length);
        }
      }, currentObject.duration * 1000); // Belirtilen süre kadar bekle
    };

    // Eğer mevcut obje bir video ise
    if (currentObject.type === 'video') {
      playVideo();
    } else {
      // Eğer resimse belirtilen süre kadar bekle ve sonraki objeye geç
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % objects.length);
      }, currentObject.duration * 1000);
    }

    // Component unmount olduğunda veya objects ya da currentIndex değiştiğinde timeout'ı temizle
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, objects]);

  // Yeni bir dosya eklendiğinde çağrılan fonksiyon
  const addFile = (file) => {
    setObjects([...objects, { ...file, nth: objects.length }]); // Yüklenen dosyayı objects dizisine ekleyin
  };

  // Video tam ekran moduna geçiş yapmak için toggle fonksiyonu
  const toggleVideoFullScreen = () => {
    const fullscreen = !isVideoFullScreen;
    if (window.electron && window.electron.toggleFullScreen) {
      window.electron.toggleFullScreen(fullscreen); // Electron API'si kullanarak tam ekran modu aç/kapat
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
                onEnded={() => {
                  if (objects.length === 1) {
                    videoRef.current.currentTime = 0; // Videoyu başa sar
                    videoRef.current.play(); // Videoyu tekrar oynat
                  } else {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % objects.length); // Bir sonraki objeye geç
                  }
                }}
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
