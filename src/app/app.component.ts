import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppManagerService } from './services/app/app-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    this.#checkLanguage();
  }

  #checkLanguage() {
    this.translateService.setDefaultLang('en');
    this.translateService.use(
      localStorage.getItem('lang') ??
        this.translateService.getBrowserLang() ??
        'en'
    );
  }
}
