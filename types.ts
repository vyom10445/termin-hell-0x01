
export interface LogEntry {
  id: string;
  timestamp: string;
  content: string;
  type: 'system' | 'hacker' | 'binary' | 'warning' | 'ai';
}

export enum AppState {
  INITIALIZING = 'INITIALIZING',
  DECODING = 'DECODING',
  PAUSED = 'PAUSED',
  THREAT_DETECTED = 'THREAT_DETECTED',
  FINISHED = 'FINISHED'
}
