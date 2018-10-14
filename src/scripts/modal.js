import { getTransformToCenter } from './utils';

const CAMERA_STATE = {
  style: {
    x: 0,
    y: 0,
    scale: 1,
    zIndex: 0,
    brightness: 1,
    contrast: 1
  }
};

class Cameras {
  constructor() {
    this.camerasInfo = {};
    this.openedCamera = null;

    this.onFullScreenOpen = this.onFullScreenOpen.bind(this);
    this.onFullScreenClose = this.onFullScreenClose.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  onTransitionEnd(event) {
    const cameraId = event.target.closest('.camera').dataset.id;
    const isCameraOpen = cameraId === this.openedCamera;
    if (!isCameraOpen && event.propertyName === 'transform') {
      this.camerasInfo[cameraId].style.zIndex = 0;
    }
  }

  init() {
    const cameras = Array.from(document.querySelectorAll('.camera'));

    this.camerasInfo = cameras.reduce(
      (info, camera) => Object.assign(info, { [camera.dataset.id]: Object.assign({}, CAMERA_STATE, {
        cameraNode: camera,
        videoContainerNode: camera.querySelector('.camera__container')
      }) }), {}
    );

    this.subscribe();
  }

  subscribe() {
    const cameras = document.querySelectorAll('.camera');
    cameras.forEach(camera => camera.addEventListener('click', this.onFullScreenOpen));

    const videoContainers = document.querySelectorAll('.camera__container');
    videoContainers.forEach(container => container.addEventListener('transitionend', this.onTransitionEnd));

    const closeButton = document.querySelector('.controls__button');
    closeButton.addEventListener('click', this.onFullScreenClose);
  }

  onFullScreenClose() {
    this.closeCamera(this.openedCamera);
    this.toggleFullScreen();
    this.render();
  }

  onFullScreenOpen(event) {
    event.preventDefault();

    const camera = event.target.closest('.camera');

    this.toggleFullScreen(camera.dataset.id);
    this.openCamera(camera.dataset.id);
    this.render();
  }

  render() {
    const { openedCamera, camerasInfo } = this;
    const hasOpenedCamera = Boolean(openedCamera);

    document.querySelector('.full-screen').classList.remove('full-screen--opened');
    document.querySelector('.controls').classList.remove('controls--opened');

    Object.values(camerasInfo).forEach((info) => {
      const { x, y, scale, zIndex } = info.style;

      info.videoContainerNode.style.zIndex = zIndex;
      info.videoContainerNode.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`;
    });

    if (hasOpenedCamera) {
      document.querySelector('.full-screen').classList.add('full-screen--opened');
      document.querySelector('.controls').classList.add('controls--opened');
    } else {
      document.querySelector('.full-screen').classList.remove('full-screen--opened');
      document.querySelector('.controls').classList.remove('controls--opened');
    }
  }

  toggleFullScreen(cameraId = null) {
    this.openedCamera = cameraId;
  }

  closeCamera(cameraId) {
    this.camerasInfo[cameraId] = Object.assign(this.camerasInfo[cameraId], {
      style: {
        ...CAMERA_STATE.style,
        zIndex: 1
      }
    });
  }

  openCamera(cameraId) {
    const { camerasInfo } = this;
    const containerNode = camerasInfo[cameraId].videoContainerNode;

    const { x, y, scale } = getTransformToCenter(containerNode);
    this.camerasInfo[cameraId] = Object.assign(this.camerasInfo[cameraId], {
      style: {
        x, y, scale, zIndex: 1
      }
    });
  }
}

const cameras = new Cameras();
cameras.init();
