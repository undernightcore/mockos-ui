import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import {
  EMPTY,
  catchError,
  defer,
  filter,
  iif,
  lastValueFrom,
  map,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { repeatPasswordValidator } from '../../validators/repeat-password.validator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { MessageInterface } from '../../interfaces/message.interface';
import { TranslateService } from '@ngx-translate/core';
import { EnvService } from '../../services/env/env.service';
import { AppManagerService } from '../../services/app/app-manager.service';
import { openToast } from 'src/app/utils/toast.utils';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  registering$ = this.activatedRoute.data.pipe(
    map((data): boolean | undefined => data['newUser']),
    filter((registering): registering is boolean => registering !== undefined),
    shareReplay(1)
  );

  authForm$ = this.registering$.pipe(
    map(
      (registering) =>
        new FormGroup(
          {
            name: new FormControl({ value: '', disabled: !registering }, [
              Validators.required,
            ]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
            repeatPassword: new FormControl(
              { value: '', disabled: !registering },
              [Validators.required]
            ),
          },
          registering ? [repeatPasswordValidator] : []
        )
    ),
    shareReplay(1)
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dialogService: MatDialog,
    private router: Router,
    private translateService: TranslateService,
    private envService: EnvService,
    appManager: AppManagerService
  ) {
    appManager.setHeaderData({ hideHeader: true });
  }

  async handleSubmit() {
    const authForm = await lastValueFrom(this.authForm$.pipe(take(1)));
    const registering = await lastValueFrom(this.registering$.pipe(take(1)));

    authForm.markAllAsTouched();
    if (authForm.invalid) return;

    iif(
      () => registering,
      this.authService.register(
        authForm.controls['name']?.value ?? '',
        authForm.controls['email'].value ?? '',
        authForm.controls['password']?.value ?? ''
      ),
      this.authService.login(
        authForm.controls['email'].value ?? '',
        authForm.controls['password'].value ?? ''
      )
    )
      .pipe(
        catchError((error) => {
          openToast(error.error.errors[0], 'error');
          return EMPTY;
        }),
        switchMap((res) =>
          defer(() =>
            registering
              ? this.#openConfirmModal(res as MessageInterface).pipe(
                  tap(() => this.router.navigate(['/auth/login']))
                )
              : of(true).pipe(tap(() => this.router.navigate(['/projects'])))
          )
        )
      )
      .subscribe();
  }

  #openConfirmModal(message: MessageInterface) {
    return this.dialogService
      .open(ConfirmModalComponent, {
        data: {
          title: this.translateService.instant(
            this.envService.getEnv('isVerificationDisabled')
              ? 'PAGES.AUTH.LOG_IN'
              : 'PAGES.AUTH.VERIFY_ACCOUNT'
          ),
          message: message.message,
          label: 'Aceptar',
        },
        autoFocus: false,
      })
      .afterClosed();
  }
}
