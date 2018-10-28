import { IAnalyser } from '../abstractions/interfaces';
import { AnalyserParams } from '../abstractions/types';
import videoCanvas from '../canvas';
import { calculateLightness } from '../utils';

class LightnessAnalyser implements IAnalyser {
  private container: HTMLElement;
  private unsubscribe: () => void;

  constructor() {
    this.container = <HTMLInputElement>document.querySelector('.lightness-analyser__value');
    this.unsubscribe = () => ({});
  }

  analyse({ source }: AnalyserParams) {
    this.unsubscribe = videoCanvas.subscribe((imageData) => {
      this.draw(source, imageData);
    });

    videoCanvas.setSource(source);
  }

  stopAnalyse() {
    videoCanvas.stopDraw();
    this.unsubscribe();
  }

  draw(video: HTMLVideoElement, imageData: ImageData) {
    if (video.paused || video.ended) return;

    const pixels = imageData.data;

    let sum = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      sum += calculateLightness(pixels, i);
    }

    const lightness = Math.round((sum / (pixels.length / 4)) * 100 / 255);

    this.container.innerHTML = String(lightness);
  }
}

export default LightnessAnalyser;
