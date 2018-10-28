import { getTransformToCenter, generateId } from './utils';
import { CameraStyle } from './abstractions/types';

const CAMERA_DEFAULT_STYLE = {
  x: 0,
  y: 0,
  scale: 1,
  zIndex: '0',
  brightness: 1,
  contrast: 1,
};

class Camera {
  private videoContainerNode: HTMLElement;
  public videoNode: HTMLVideoElement;
  public style: CameraStyle;
  public readonly id: string;

  constructor(node: HTMLVideoElement) {
    this.style = CAMERA_DEFAULT_STYLE;
    this.id = node.dataset.id || generateId();
    this.videoContainerNode = <HTMLElement>node.querySelector('.camera__container');
    this.videoNode = <HTMLVideoElement>node.querySelector('video');
  }

  render() {
    const { style, videoContainerNode } = this;
    const { x, y, scale, zIndex, brightness, contrast } = style;

    videoContainerNode.style.zIndex = zIndex;
    videoContainerNode.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`;
    videoContainerNode.style.filter = `brightness(${brightness}) contrast(${contrast})`;
  }

  styleChange(field: keyof CameraStyle, value: string) {
    this.style[field] = value;
  }

  close() {
    this.style = Object.assign({}, this.style, {
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 1,
    });

    this.mute();
  }

  open() {
    const { videoContainerNode } = this;

    const { x, y, scale } = getTransformToCenter(videoContainerNode);
    this.style = Object.assign({}, this.style, {
      x, y, scale, zIndex: 1,
    });

    this.unMute();
  }

  putDown() {
    this.style.zIndex = '0';
  }

  mute() {
    this.videoNode.muted = true;
  }

  unMute() {
    this.videoNode.muted = false;
  }

  hide() {
    this.videoContainerNode.style.visibility = 'hidden';
  }

  show() {
    this.videoContainerNode.style.visibility = 'visible';
  }
}

export default Camera;
