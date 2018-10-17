import Hls from 'hls.js';
import Cameras from './cameras';
import '../styles/index.less';
import MovementAnalyser from './movement-analyser';
import volumeVisualizer from './volume-visualizer';
import AudioAnalyser from './audio-analyser';
import LightnessAnalyser from './lightness-analyser';

const VIDEO_URLS = [
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
];

const initVideo = (video, url) => {
  if (Hls.isSupported()) {
    const hls = new Hls();

    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
};

VIDEO_URLS.forEach((url, index) => {
  initVideo(document.getElementById(`video-${index + 1}`), url);
});

const lightnessAnalyser = new LightnessAnalyser();
const movementAnalyser = new MovementAnalyser();
const audioAnalyser = new AudioAnalyser({
  visualizers: [volumeVisualizer]
});

audioAnalyser.init();

const cameras = new Cameras({
  analysers: [
    audioAnalyser,
    lightnessAnalyser,
    movementAnalyser
  ]
});

cameras.init();
