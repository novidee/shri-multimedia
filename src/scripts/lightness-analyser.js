import videoCanvas from './canvas';
import { calculateLightness } from './utils';

class LightnessAnalyser {
  constructor() {
    this.container = document.querySelector('.data');
  }

  styleChange(field, value) {
    this[field] = Number(value);
  }

  analyse({ source }) {
    this.unsubscribe = videoCanvas.subscribe((imageData) => {
      this.draw(source, imageData);
    });

    videoCanvas.setSource(source);
  }

  stopAnalyse() {
    videoCanvas.stopDraw();
    this.unsubscribe();
  }

  draw(video, imageData) {
    if (video.paused || video.ended) return;

    const pixels = imageData.data;

    let sum = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      sum += calculateLightness(pixels, i);
    }

    this.container.innerHTML = Math.round((sum / (pixels.length / 4)) * 100 / 255);
  }
}

export default LightnessAnalyser;
