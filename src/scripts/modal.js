import analyser from './audio-analyser';
import Camera from './camera';

const canvas = document.querySelector('#analyser');
const context = canvas.getContext('2d');

const SELECTORS = {
  camera: '.camera',
  cameraContainer: '.camera__container',
  controlsButton: '.controls__button',
  brightnessControl: '#brightness-control',
  contrastControl: '#contrast-control',
  fullScreen: '.full-screen',
  controls: '.controls'
};

const NODES = {
  brightnessControl: document.querySelector(SELECTORS.brightnessControl),
  contrastControl: document.querySelector(SELECTORS.contrastControl),
  cameras: document.querySelectorAll(SELECTORS.camera),
  fullScreen: document.querySelector(SELECTORS.fullScreen),
  controls: document.querySelector(SELECTORS.controls)
};

class Cameras {
  constructor() {
    this.cameras = {};
    this.openedCamera = null;

    this.closeCamera = cameraId => this.cameras[cameraId].close();
    this.openCamera = cameraId => this.cameras[cameraId].open();
    this.toggleFullScreen = (cameraId = null) => { this.openedCamera = cameraId; };

    this.onCameraClick = this.onCameraClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  init() {
    const cameras = Array.from(NODES.cameras);

    this.cameras = cameras.reduce(
      (info, cameraNode) => Object.assign(info, {
        [cameraNode.dataset.id]: new Camera(cameraNode)
      }), {}
    );

    this.subscribe();
    this.render();
  }

  subscribe() {
    NODES.cameras.forEach(camera => camera.addEventListener('click', this.onCameraClick));

    const videoContainers = document.querySelectorAll(SELECTORS.cameraContainer);
    videoContainers.forEach(container => container.addEventListener('transitionend', this.onTransitionEnd));

    const closeButton = document.querySelector(SELECTORS.controlsButton);
    closeButton.addEventListener('click', this.onCloseClick);

    NODES.brightnessControl.addEventListener('input', this.onControlChange('brightness'));
    NODES.contrastControl.addEventListener('input', this.onControlChange('contrast'));
  }

  onTransitionEnd(event) {
    const cameraId = event.target.closest(SELECTORS.camera).dataset.id;
    const isCameraOpen = cameraId === this.openedCamera;
    if (!isCameraOpen && event.propertyName === 'transform') {
      this.cameras[cameraId].putDown();
      this.render();
    }
  }

  onControlChange(field) {
    return (event) => {
      const { cameras, openedCamera } = this;
      cameras[openedCamera].styleChange(field, event.target.value);
      this.render();
    };
  }

  onCloseClick() {
    this.closeCamera(this.openedCamera);
    this.toggleFullScreen();

    this.turnOffAnalyser();

    this.render();
  }

  onCameraClick(event) {
    const camera = event.target.closest(SELECTORS.camera);
    const cameraId = camera.dataset.id;

    this.turnOffAnalyser = analyser.createSource({
      source: this.cameras[cameraId].videoNode,
      sourceId: cameraId,
      onProcess: this.onProcess
    });

    this.toggleFullScreen(cameraId);
    this.openCamera(cameraId);
    this.render();
  }

  onProcess(data) {
    const MAX_FREQUENCY = 255;
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);

    context.fillStyle = 'transparent';
    context.fillRect(0, 0, width, height);

    const barWidth = (width / data.length);
    let barHeight;
    let x = 0;
    let y = 0;

    context.fillStyle = '#ffd93e';

    data.forEach((bar, index) => {
      barHeight = bar / MAX_FREQUENCY * height;
      x = barWidth * index;
      y = height - barHeight;
      context.fillRect(x, y, barWidth, barHeight);
    });
  }

  render() {
    const { openedCamera, cameras } = this;
    const hasOpenedCamera = Boolean(openedCamera);

    Object.values(cameras).forEach(camera => camera.render());

    const classAction = hasOpenedCamera ? 'add' : 'remove';
    NODES.fullScreen.classList[classAction]('full-screen--opened');
    NODES.controls.classList[classAction]('controls--opened');

    if (hasOpenedCamera) {
      NODES.brightnessControl.value = cameras[openedCamera].style.brightness;
      NODES.contrastControl.value = cameras[openedCamera].style.contrast;
    }
  }
}

const cameras = new Cameras();
analyser.init();
cameras.init();
