import { getTransformToCenter } from './utils';

const CAMERA_STATE = {
  isOpen: false
};

class Cameras {
  constructor() {
    this.camerasInfo = {};

    this.onFullScreenOpen = this.onFullScreenOpen.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  onTransitionEnd(event) {
    const isCameraOpen = this.camerasInfo[event.target.closest('.camera').dataset.id].isOpen;
    console.log('dasdad', isCameraOpen);
    if (!isCameraOpen && event.propertyName === 'transform') {
      event.target.style.zIndex = 0;
    }
  }

  init() {
    const cameras = document.querySelectorAll('.camera');

    this.camerasInfo = Array.from(cameras).reduce(
      (info, camera) => Object.assign(info, { [camera.dataset.id]: CAMERA_STATE }), {}
    );

    this.subscribe();
  }

  subscribe() {
    const cameras = document.querySelectorAll('.camera');
    cameras.forEach(camera => camera.addEventListener('click', this.onFullScreenOpen));

    const videoContainers = document.querySelectorAll('.camera__container');
    videoContainers.forEach(container => container.addEventListener('transitionend', this.onTransitionEnd));
  }

  onFullScreenOpen(event) {
    event.preventDefault();

    const camera = event.target.closest('.camera');
    const videoContainer = camera.querySelector('.camera__container');

    const isCameraOpen = this.camerasInfo[camera.dataset.id].isOpen;

    document.querySelector('.full-screen').classList.toggle('full-screen--opened');
    document.querySelector('.controls').classList.toggle('controls--opened');

    const transform = getTransformToCenter(videoContainer);

    if (!isCameraOpen) {
      videoContainer.style.zIndex = 1;
      videoContainer.style.transform = `
      translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${transform.scale})
    `;
    } else {
      videoContainer.style.transform = `
      translate3d(${0}px, ${0}px, 0px) scale(${1})
    `;
    }

    this.toggleCamera(camera.dataset.id);
  }

  toggleCamera(id) {
    this.camerasInfo[id].isOpen = !this.camerasInfo[id].isOpen;
  }
}

const cameras = new Cameras();
cameras.init();
