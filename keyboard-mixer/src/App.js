import {useEffect, useState, useRef} from 'react';
import noInputVideo from './noinput.mov';
import './App.css';

function App() {
  const [curVideo, setCurVideo] = useState(null);
  const [selectedFiles, _setSelectedFiles] = useState([]);
  const selectedFilesRef = useRef(selectedFiles);
  const setSelectedFiles = (newFiles) => {
    selectedFiles.current = newFiles;
    _setSelectedFiles(newFiles);
  };
  let debugInfo = '';

  // DEV
  // workaround for react hook state not being updated in event handlers
  useEffect(() => {
    const keyDownListener = (e) => {
      const selectedVideo = selectedFilesRef.current.current[e.keyCode - 65];
      if (e.keyCode >= 65 && e.keyCode <= 90 && selectedVideo) {
        setCurVideo(URL.createObjectURL(selectedVideo));
      } else {
        setCurVideo(noInputVideo);
      }
    };
    window.addEventListener('keydown', keyDownListener);
  }, []);

  debugInfo += `curVideo: ${curVideo}\n`;

  return (
    <div className="App">
      <form>
        <input
          type="file"
          onChange={(e) => setSelectedFiles(e.target.files)}
          accept="video/*"
          multiple
        />
      </form>
      <video src={curVideo} autoPlay loop className="main-video" />
      <code>{debugInfo}</code>
    </div>
  );
}

export default App;
