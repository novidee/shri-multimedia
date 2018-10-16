class AudioAnalyser {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.processor = null;
    this.analyser = null;
    this.sources = {};
  }

  init() {
    this.createProcessor();
    this.createAnalyser();
  }

  createAnalyser() {
    const { context, processor } = this;

    const analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.4;
    analyser.fftSize = 256;

    analyser.connect(context.destination);
    processor.connect(context.destination);

    this.analyser = analyser;
  }

  createProcessor() {
    this.processor = this.context.createScriptProcessor(0, 1, 1);
  }

  createSource({ source, sourceId, onProcess }) {
    const { analyser, processor, context } = this;

    this.sources[sourceId] = this.sources[sourceId]
      || this.context.createMediaElementSource(source);
    const currentSource = this.sources[sourceId];

    currentSource.connect(analyser);
    analyser.connect(processor);

    processor.connect(context.destination);
    const frequencies = new Uint8Array(analyser.frequencyBinCount);

    processor.onaudioprocess = () => {
      analyser.getByteFrequencyData(frequencies);

      onProcess(frequencies);
    };

    return () => {
      currentSource.disconnect(analyser);
      analyser.disconnect(processor);
      processor.disconnect(context.destination);
    };
  }
}

export default new AudioAnalyser();
