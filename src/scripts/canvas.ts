import { ICallback } from './abstractions/interfaces';

class VideoCanvas {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;
  private source?: HTMLVideoElement;
  private isDrawing: boolean;
  private callbacks: ICallback[];
  private animationFrameId?: number;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.callbacks = [];
  }

  setSource(source: HTMLVideoElement) {
    const { clientWidth, clientHeight } = source;

    this.source = source;

    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;

    if (!this.isDrawing) {
      this.draw();
    }
  }

  subscribe(callback: ICallback) {
    this.callbacks.push(callback);

    return () => {
      this.callbacks = this.callbacks.filter(c => c !== callback);
    };
  }

  draw() {
    const { source, context, canvas, callbacks } = this;
    if (!context) return;

    context.drawImage(<CanvasImageSource>source, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    this.isDrawing = true;

    this.animationFrameId = requestAnimationFrame(() => {
      this.draw();
      callbacks.forEach(callback => callback(imageData, canvas.width));
    });
  }

  stopDraw() {
    this.isDrawing = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

export default new VideoCanvas();
