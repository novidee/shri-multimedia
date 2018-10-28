import { IVisualizer } from './abstractions/interfaces';

class AudioVisualizer implements IVisualizer {
  private readonly canvas: HTMLCanvasElement | null;
  private readonly context: CanvasRenderingContext2D | null;

  constructor() {
    this.canvas = document.querySelector('#volume-analyser');
    this.context = this.canvas && this.canvas.getContext('2d');
  }

  visualize(data: Uint8Array) {
    const { canvas, context } = this;

    if (!canvas || !context) return;

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
}

export default new AudioVisualizer();
