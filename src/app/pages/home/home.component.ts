import { Component, HostListener } from '@angular/core';
import { AppManagerService } from '../../services/app/app-manager.service';
import {
  fromEvent,
  map,
  shareReplay,
  take,
} from 'rxjs';
import { Router } from '@angular/router';

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

  @HostListener('window:keydown.m')
  onMPress() {
    this.router.navigate(['/auth', 'login'])
  }

  constructor(appManager: AppManagerService, private router: Router) {
    appManager.setHeaderData({ hideHeader: true });
  }
}
