import { IAnalyser } from './abstractions/interfaces';
import { CameraStyle } from './abstractions/types';
import Camera from './camera';

const SELECTORS = {
  camera: '.camera',
  cameraContainer: '.camera__container',
  controlsButton: '.controls__button',
  brightnessControl: '#brightness-control',
  contrastControl: '#contrast-control',
  fullScreen: '.full-screen',
  controls: '.controls',
};

const NODES = {
  brightnessControl: <HTMLInputElement>document.querySelector(SELECTORS.brightnessControl),
  contrastControl: <HTMLInputElement>document.querySelector(SELECTORS.contrastControl),
  cameras: document.querySelectorAll(SELECTORS.camera),
  fullScreen: document.querySelector(SELECTORS.fullScreen),
  controls: document.querySelector(SELECTORS.controls),
};

class Cameras {
  private analysers: IAnalyser[];
  private cameras: {[id: string]: Camera};
  private openedCamera?: string;
  private closeCamera: (cameraId: string) => void;
  private openCamera: (cameraId: string) => void;
  private toggleFullScreen: (cameraId?: string) => void;

  constructor({ analysers }: { analysers: IAnalyser[] }) {
    this.cameras = {};
    this.analysers = analysers;

    this.closeCamera = cameraId => this.cameras[cameraId].close();
    this.openCamera = cameraId => this.cameras[cameraId].open();
    this.toggleFullScreen = (cameraId) => { this.openedCamera = cameraId; };

    this.onCameraClick = this.onCameraClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  init() {
    const cameras = <HTMLVideoElement[]>Array.from(NODES.cameras);

    this.cameras = cameras.reduce(
      (info, cameraNode) => Object.assign(info, {
        [<string>cameraNode.dataset.id]: new Camera(cameraNode),
      }), {},
    );

    this.subscribe();
    this.render();
  }

  subscribe() {
    NODES.cameras.forEach(camera => camera.addEventListener('click', this.onCameraClick));

    const videoContainers = document.querySelectorAll(SELECTORS.cameraContainer);
    videoContainers.forEach(container => container.addEventListener('transitionend', this.onTransitionEnd));

    const closeButton = document.querySelector(SELECTORS.controlsButton);
    if (closeButton) {
      closeButton.addEventListener('click', this.onCloseClick);
    }

    if (NODES.brightnessControl && NODES.contrastControl) {
      NODES.brightnessControl.addEventListener('input', this.onControlChange('brightness'));
      NODES.contrastControl.addEventListener('input', this.onControlChange('contrast'));
    }
  }

  onTransitionEnd(event: Event) {
    const target = <HTMLElement>event.target;
    if (!target) return;

    const closestCamera = <HTMLElement>target.closest(SELECTORS.camera);
    const cameraId = closestCamera && closestCamera.dataset.id;
    const isCameraOpen = cameraId === this.openedCamera;

    const transitionEvent = <TransitionEvent>event;
    if (!isCameraOpen && transitionEvent.propertyName === 'transform') {
      this.cameras[<string>cameraId].putDown();
      this.render();
    }
  }

  onControlChange(field: keyof CameraStyle) {
    return (event: Event) => {
      const { cameras, openedCamera } = this;
      const target = <HTMLInputElement>event.target;
      if (!target) return;

      cameras[<string>openedCamera].styleChange(field, target.value);

      this.render();
    };
  }

  onCloseClick() {
    if (!this.openedCamera) return;

    this.closeCamera(this.openedCamera);
    this.showCameras(this.openedCamera);
    this.toggleFullScreen();

    this.analysers.forEach(analyser => analyser.stopAnalyse());

    this.render();
  }

  onCameraClick(event: Event) {
    const target = <HTMLElement>event.target;
    const camera = <HTMLElement>target.closest(SELECTORS.camera);
    if (!camera) return;

    const cameraId = camera.dataset.id;

    if (!cameraId || cameraId === this.openedCamera) return;

    this.analysers.forEach(analyser => analyser.analyse({
      source: this.cameras[cameraId].videoNode,
      sourceId: cameraId,
    }));

    this.toggleFullScreen(cameraId);
    this.openCamera(cameraId);
    this.hideCameras(cameraId);
    this.render();
  }

  hideCameras(cameraId: string) {
    Object.values(this.cameras).forEach((camera) => {
      if (camera.id !== cameraId) camera.hide();
    });
  }

  showCameras(cameraId: string) {
    Object.values(this.cameras).forEach((camera) => {
      if (camera.id !== cameraId) camera.show();
    });
  }

  render() {
    const { openedCamera, cameras } = this;
    const hasOpenedCamera = Boolean(openedCamera);

    Object.values(cameras).forEach(camera => camera.render());

    const classAction = hasOpenedCamera ? 'add' : 'remove';

    if (NODES.fullScreen && NODES.controls) {
      NODES.fullScreen.classList[classAction]('full-screen--opened');
      NODES.controls.classList[classAction]('controls--opened');
    }

    if (!openedCamera) return;

    if (NODES.brightnessControl && NODES.contrastControl) {
      NODES.brightnessControl.value = String(cameras[openedCamera].style.brightness);
      NODES.contrastControl.value = String(cameras[openedCamera].style.contrast);
    }
  }
}

export default Cameras;
