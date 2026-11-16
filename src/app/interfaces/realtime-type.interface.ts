export type RealtimeType = 'updated' | 'deleted' | 'headers';

export enum RealtimeLogType {
  ERROR = 'error',
  LOG = 'log',
}

export type RealtimeTerminalLog = {
  logs: RealtimeLog[];
  time: string;
  url: string;
  method: string;
  responseId: number;
};

export type RealtimeLog = {
  message: string;
  time: string;
  type: RealtimeLogType;
};
