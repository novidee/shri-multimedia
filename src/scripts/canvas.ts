class VideoCanvas {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.source = null;
    this.isDrawing = false;
    this.callbacks = [];
  }

  setSource(source) {
    const { clientWidth, clientHeight } = source;

    this.source = source;

    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;

    if (!this.isDrawing) {
      this.draw();
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback);

    return () => {
      this.callbacks = this.callbacks.filter(c => c !== callback);
    };
  }

  draw() {
    this.isDrawing = true;

    const { source, context, canvas, callbacks } = this;
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    this.animationFrameId = requestAnimationFrame(() => {
      this.draw();
      callbacks.forEach(callback => callback(imageData, canvas.width));
    });
  }

  stopDraw() {
    this.isDrawing = false;

    cancelAnimationFrame(this.animationFrameId);
  }
}

export default new VideoCanvas();
