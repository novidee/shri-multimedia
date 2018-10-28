import { IVisualizer, IAnalyser } from '../abstractions/interfaces';
import { AnalyserParams } from '../abstractions/types';

class AudioAnalyser implements IAnalyser {
  private context: AudioContext;
  private processor: ScriptProcessorNode;
  private analyser: AnalyserNode;
  private sources: {[id: string]: MediaElementAudioSourceNode};
  private visualizers: IVisualizer[];
  public stopAnalyse: () => void;

  constructor({ visualizers }: { visualizers: IVisualizer[] }) {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.processor = this.createProcessor();
    this.analyser = this.createAnalyser();
    this.sources = {};
    this.visualizers = visualizers;

    this.stopAnalyse = () => {
      this.analyser.disconnect(this.processor);
      this.processor.disconnect(this.context.destination);
    };
  }

  createAnalyser() {
    const { context, processor } = this;

    const analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.4;
    analyser.fftSize = 256;

    analyser.connect(context.destination);
    processor.connect(context.destination);

    return analyser;
  }

  createProcessor() {
    return this.context.createScriptProcessor(0, 1, 1);
  }

  analyse({ source, sourceId }: AnalyserParams) {
    const { analyser, processor, context, visualizers } = this;
    const currentSourceId = <string>sourceId;

    this.sources[currentSourceId] = this.sources[currentSourceId]
      || this.context.createMediaElementSource(source);
    const currentSource = this.sources[currentSourceId];

    currentSource.connect(analyser);
    analyser.connect(processor);

    processor.connect(context.destination);
    const frequencies = new Uint8Array(analyser.frequencyBinCount);

    processor.onaudioprocess = () => {
      analyser.getByteFrequencyData(frequencies);

      visualizers.forEach(visualizer => visualizer.visualize(frequencies));
    };

    this.stopAnalyse = () => {
      currentSource.disconnect(analyser);
      analyser.disconnect(processor);
      processor.disconnect(context.destination);
    };
  }
}

export default AudioAnalyser;
