import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  distinctUntilChanged,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { InvitationInterface } from '../../interfaces/invitation.interface';
import { AppManagerService } from '../../services/app/app-manager.service';
import { AuthService } from '../../services/auth/auth.service';
import { InvitationsService } from '../../services/invitations/invitations.service';
import { RealtimeService } from '../../services/realtime/realtime.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isLogged$ = this.authService.isLogged.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );
  currentUser$ = this.isLogged$.pipe(
    switchMap((logged) =>
      logged ? this.authService.getUser() : of(undefined)
    ),
    shareReplay(1)
  );

  showHeader$ = this.appManager.headerData$.pipe(
    map((data) => !data?.hideHeader),
    shareReplay(1)
  );
  breadcrumb$ = this.appManager.headerData$.pipe(
    map((data) => data?.breadcrumb),
    shareReplay(1)
  );
  actions$ = this.appManager.headerData$.pipe(
    map((data) => data?.actions),
    shareReplay(1)
  );

  #reloadInvitations = new Subject<void>();
  invitations$: Observable<InvitationInterface[]> =
    this.authService.isLogged.pipe(
      switchMap((logged) =>
        logged
          ? this.realtimeService.listenUserInvitations().pipe(
              startWith(1),
              switchMap(() =>
                this.#reloadInvitations.pipe(
                  startWith(true),
                  switchMap(() => this.invitationsService.getInvitations())
                )
              ),
              map((invitations) => invitations.data)
            )
          : of([])
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  invitationNumber$ = this.invitations$.pipe(
    map((invitation) => invitation.length || null),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  languages = ['en', 'es'];

  constructor(
    private appManager: AppManagerService,
    private authService: AuthService,
    private router: Router,
    public translateService: TranslateService,
    private realtimeService: RealtimeService,
    private invitationsService: InvitationsService
  ) {}

  changeLanguage(language: string) {
    this.translateService.use(language);
    localStorage.setItem('lang', this.translateService.currentLang);
  }

  resolveInvitation(invitationId: number, accepted: boolean) {
    this.invitationsService[accepted ? 'acceptInvitation' : 'rejectInvitation'](
      invitationId
    ).subscribe(() => this.#reloadInvitations.next());
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
