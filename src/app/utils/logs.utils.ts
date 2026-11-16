import { RealtimeLog } from '../interfaces/realtime-type.interface';
import { DateTime } from 'luxon';

export function sortLogs(a: RealtimeLog, b: RealtimeLog) {
  if (a.traceId !== b.traceId) {
    return b.traceId - a.traceId;
  }

  return (
    DateTime.fromISO(a.time).toJSDate().getTime() -
    DateTime.fromISO(b.time).toJSDate().getTime()
  );
}
