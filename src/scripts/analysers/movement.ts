import { AnalyserParams } from '../abstractions/types';
import videoCanvas from '../canvas';
import { throttle, calculateLightness } from '../utils';

const DELTA = 50;
const FRAMES_DELAY = 75;

class MovementAnalyser {
  private readonly canvas: HTMLCanvasElement | null;
  private readonly context: CanvasRenderingContext2D | null;
  private prevImageData?: ImageData;
  private unsubscribe: () => void;

  constructor() {
    this.canvas = document.querySelector('#movement-analyser');
    this.context = this.canvas && this.canvas.getContext('2d');

    this.unsubscribe = () => ({});

    this.draw = this.draw.bind(this);
  }

  analyse({ source }: AnalyserParams) {
    if (!this.canvas) return;

    if (!source || !source.parentElement) return;

    source.parentElement.appendChild(this.canvas);
    this.canvas.style.zIndex = '2';

    const { clientWidth, clientHeight } = source;

    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;

    this.unsubscribe = videoCanvas.subscribe(throttle(this.draw, FRAMES_DELAY));

    videoCanvas.setSource(source);
  }

  stopAnalyse() {
    if (!this.canvas) return;

    this.canvas.style.zIndex = '-1';
    videoCanvas.stopDraw();
    this.unsubscribe();
  }

  draw(imageData: ImageData, canvasWidth: number) {
    if (!this.prevImageData) this.prevImageData = imageData;

    let firstPixel = 0;
    let lastPixel = 0;

    let currentLightness;
    let previousLightness;

    for (let i = 0; i < imageData.data.length; i += 4) {
      currentLightness = calculateLightness(imageData.data, i);
      previousLightness = calculateLightness(this.prevImageData.data, i);

      if (Math.abs(currentLightness - previousLightness) > DELTA) {
        if (!firstPixel) firstPixel = i / 4;
        lastPixel = i / 4;
      }
    }

    this.prevImageData = imageData;

    const startX = firstPixel % canvasWidth;
    const startY = firstPixel / canvasWidth;
    const endX = (lastPixel % canvasWidth) - startX;
    const endY = (lastPixel / canvasWidth) - startY;

    this.drawIndicator(startX, startY, endX, endY);
  }

  drawIndicator(startX: number, startY: number, endX: number, endY: number) {
    const { context, canvas } = this;
    if (!canvas || !context) return;

    context.strokeStyle = 'red';

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    context.rect(startX, startY, endX, endY);
    context.stroke();
  }
}

export default MovementAnalyser;
