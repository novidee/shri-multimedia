import { AnalyserParams } from '../types';

interface IAnalyser {
  analyse(params: AnalyserParams): void;
  stopAnalyse(): void;
}

export {
  IAnalyser,
};
