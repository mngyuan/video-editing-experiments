import {useEffect, useState} from 'react';
import {useMeasure} from 'react-use';
import * as Papa from 'papaparse';

import './App.css';

const Filmstrip = ({findScene}) => {
  const [ref, {width, height}] = useMeasure();
  // 1=whole film, 0=frame by frame
  const zoomLevel = 1;
  const frameheight = 100;
  const frameaspectratio = 1912 / 1032;
  const framewidth = frameheight * frameaspectratio;
  const framesonstrip = Math.floor(width / framewidth);

  return (
    <div className="filmstrip" ref={ref}>
      {[...Array(framesonstrip).keys()].map((i) => (
        <img
          src={`${process.env.PUBLIC_URL}/drivemycar/sceneimages/${findScene(
            (1 / framesonstrip) * i,
          )['Scene Number'].padStart(3, '0')}.jpg`}
        />
      ))}
    </div>
  );
};

function App() {
  const [sceneData, setSceneData] = useState([]);
  useEffect(() => {
    async function fetchCSV() {
      const resp = await fetch(
        `${process.env.PUBLIC_URL}/drivemycar/drivemycarscenes.csv`,
      );
      const rawcsv = await resp.text();
      const sceneCSV = Papa.parse(rawcsv, {header: true});
      // papaparse results in the last object being empty, not sure why
      setSceneData(sceneCSV.data.slice(0, sceneCSV.data.length - 1));
    }
    fetchCSV();
  }, []);

  const lastFrame =
    sceneData.length > 0 ? sceneData[sceneData.length - 1]['End Frame'] : 0;
  const findScene = (percent) => {
    const frameNeedle = Math.round(percent * lastFrame);
    for (const scene of sceneData) {
      if (
        frameNeedle <= scene['End Frame'] &&
        frameNeedle >= scene['Start Frame']
      ) {
        return scene;
      }
    }
  };

  useEffect(() => {
    async function fetchImages() {
      // fetch all scene images
      await Promise.all(
        sceneData.map((scene) =>
          fetch(
            `${process.env.PUBLIC_URL}/drivemycar/sceneimages/${scene[
              'Scene Number'
            ].padStart(3, '0')}.jpg`,
          ),
        ),
      );
    }
    fetchImages();
  }, []);

  return (
    <div className="App">
      {sceneData.length > 0 ? <Filmstrip findScene={findScene} /> : null}
    </div>
  );
}

export default App;
