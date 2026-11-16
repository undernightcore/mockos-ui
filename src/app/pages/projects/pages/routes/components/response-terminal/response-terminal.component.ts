import { DialogRef } from '@angular/cdk/dialog';
import { map } from 'rxjs/operators';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { scan, shareReplay, tap } from 'rxjs';
import { ProcessorInterface } from '../../../../../../interfaces/processor.interface';
import { DialogModule } from '../../../../../../components/dialog/dialog.module';
import { TranslateModule } from '@ngx-translate/core';
import { RealtimeService } from '../../../../../../services/realtime/realtime.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  RealtimeLog,
  RealtimeLogType,
} from '../../../../../../interfaces/realtime-type.interface';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-response-terminal',
  templateUrl: './response-terminal.component.html',
  styleUrls: ['./response-terminal.component.scss'],
  standalone: true,
  imports: [DialogModule, TranslateModule, AsyncPipe, NgForOf, NgIf],
})
export class ResponseTerminalComponent {
  readonly logTypes = RealtimeLogType;

  readonly logs$ = this.realtimeService
    .listenResponseLogs(this.data.responseId)
    .pipe(
      map((response) => response.logs),
      scan((acc, current) => [...acc, ...current], [] as RealtimeLog[]),
      map((logs) =>
        [...logs].sort(
          (a, b) =>
            DateTime.fromISO(b.time).toJSDate().getTime() -
            DateTime.fromISO(a.time).toJSDate().getTime()
        )
      ),
      tap((logs) => console.log(logs)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  readonly hasLogs$ = this.logs$.pipe(map((logs) => logs.length > 0));

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      responseId: number;
      processor: ProcessorInterface | undefined;
    },
    public dialogRef: DialogRef,
    private realtimeService: RealtimeService
  ) {}

  trackByLog(_: number, log: RealtimeLog) {
    return log.time;
  }
}
