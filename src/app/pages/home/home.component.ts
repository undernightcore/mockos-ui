import { Component } from '@angular/core';
import { AppManagerService } from '../../services/app/app-manager.service';
import {
  debounce,
  exhaustMap,
  fromEvent,
  map,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
  throttle,
  throttleTime,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  sticky$ = fromEvent<{ target: HTMLDivElement }>(window, 'scroll', {
    capture: true,
  }).pipe(
    map(() => true),
    take(1),
    shareReplay(1)
  );

  constructor(appManager: AppManagerService) {
    appManager.setHeaderData({ hideHeader: true });
  }
}
