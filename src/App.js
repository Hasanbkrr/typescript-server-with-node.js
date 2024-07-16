import React, { useState, useEffect, useRef } from 'react';
import FileUpload from './components/FileUpload';
import './index.css';

function App() {
  const [objects, setObjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const addFile = (fileWithDuration) => {
    const { file, duration, type, name } = fileWithDuration;

    if (!(file instanceof Blob)) {
      console.error('File must be a Blob type.');
      return;
    }

    if (!window.electron || !window.electron.ipcRenderer) {
      console.error('Electron API is not available');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log('Sending save-file event');
      const filePath = window.electron.ipcRenderer.sendSync('save-file', {
        name: file.name,
        data: uint8Array
      });
      console.log('Received file path:', filePath);
      console.log('File type:', type); // Dosya tipini yazdır
      setObjects((prevObjects) => [
        ...prevObjects,
        { name, src: filePath, duration, type }
      ]);
    };
    reader.readAsArrayBuffer(file);
  };

  const startPlaying = async () => {
    const files = await window.electron.ipcRenderer.invoke('get-files');
    setObjects(files);
    setIsPlaying(true);
    setCurrentIndex(0);
  };

  const goToNextObject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % objects.length);
  };

  const toggleVideoFullScreen = () => {
    const fullscreen = !isVideoFullScreen;
    if (window.electron && window.electron.toggleFullScreen) {
      window.electron.toggleFullScreen(fullscreen);
      setIsVideoFullScreen(fullscreen);
    } else {
      console.error('Electron API is not available');
    }
  };

  useEffect(() => {
    if (objects.length === 0 || !isPlaying) return;

    const currentObject = objects[currentIndex];
    let timeoutId;

    if (currentObject.type === 'video') {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        timeoutId = setTimeout(goToNextObject, currentObject.duration * 1000);
      }
    } else {
      timeoutId = setTimeout(goToNextObject, currentObject.duration * 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [currentIndex, objects, isPlaying]);

  return (
    <div className="App">
      {!isPlaying ? (
        <div>
          <FileUpload onAddFile={addFile} />
          <button onClick={startPlaying}>Play</button>
        </div>
      ) : (
        <div>
          {objects.length > 0 && (
            <div>
              {objects[currentIndex].type === 'image' ? (
                <img
                  src={objects[currentIndex].src}
                  alt={objects[currentIndex].name}
                  onLoad={() => setTimeout(goToNextObject, objects[currentIndex].duration * 1000)}
                />
              ) : (
                <div>
                  <video
                    ref={videoRef}
                    src={objects[currentIndex].src}
                    onEnded={goToNextObject}
                    autoPlay
                    controls
                  />
                  <button className="fullscreen-button" onClick={toggleVideoFullScreen}>
                    {isVideoFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
