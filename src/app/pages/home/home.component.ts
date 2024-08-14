import { Component } from '@angular/core';
import { AppManagerService } from '../../services/app/app-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(appManager: AppManagerService) {
    appManager.setHeaderData({});
  }
}
