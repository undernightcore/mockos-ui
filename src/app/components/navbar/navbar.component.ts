import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {AppManagerService} from "../../services/app/app-manager.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isLogged$ = this.authService.isLogged;
  headerData$ = this.appManager.headerData$;

  languages = this.translateService.getLangs();

  constructor(
    private appManager: AppManagerService,
    private authService: AuthService,
    private router: Router,
    public translateService: TranslateService
  ) {}

  changeLanguage(language: string) {
    this.translateService.use(language);
    localStorage.setItem('lang', this.translateService.currentLang);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  logIn() {
    this.router.navigate(['/auth', 'login']);
  }
}
