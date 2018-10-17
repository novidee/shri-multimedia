class LightnessAnalyser {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.container = document.querySelector('.data');
  }

  styleChange(field, value) {
    this[field] = Number(value);
  }

  analyse(video) {
    const { canvas, context } = this;
    const { clientWidth, clientHeight } = video;

    canvas.width = clientWidth;
    canvas.height = clientHeight;
    this.draw(video, context, clientWidth, clientHeight);
  }

  stopAnalyse() {
    cancelAnimationFrame(this.animationFrameId);
  }

  draw(video, canvas, width, height) {
    if (video.paused || video.ended) return;
    canvas.drawImage(video, 0, 0, width, height);

    const { data } = canvas.getImageData(0, 0, width, height);

    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      sum += (r + g + b) / 3;
    }

    this.container.innerHTML = Math.round((sum / (data.length / 4)) * 100 / 255);

    this.animationFrameId = requestAnimationFrame(() => {
      this.draw(video, canvas, width, height);
    });
  }
}

export default LightnessAnalyser;
