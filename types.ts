export enum AnalysisStatus {
  IDLE = 'idle',
  SCANNING = 'scanning',
  COMPLETE = 'complete',
  ERROR = 'error'
}

export interface AnalysisResult {
  markdown: string;
}

export interface LoadingPhase {
  text: string;
  duration: number;
}
