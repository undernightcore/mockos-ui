import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { iif } from 'rxjs';
import { repeatPasswordValidator } from '../../validators/repeat-password.validator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { MessageInterface } from '../../interfaces/message.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  newUser?: boolean;
  authForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dialogService: MatDialog,
    private router: Router
  ) {
    console.log(this.newUser);
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      if (data['newUser'] ?? true) {
        this.#addRegisterControls();
      }
      this.newUser = data['newUser'] ?? true;
    });
  }

  handleSubmit() {
    if (this.authForm.invalid) return;
    iif(
      () => this.newUser ?? true,
      this.authService.register(
        this.authForm.controls['name']?.value ?? '',
        this.authForm.controls['email'].value,
        this.authForm.controls['password']?.value
      ),
      this.authService.login(
        this.authForm.controls['email'].value,
        this.authForm.controls['password'].value
      )
    ).subscribe((res) => {
      if (!this.newUser) {
        this.router.navigate(['/dashboard']);
        return;
      }
      this.dialogService
        .open(ConfirmModalComponent, {
          data: {
            title: 'Valida tu cuenta',
            message: (res as MessageInterface).message,
          },
        })
        .afterClosed()
        .subscribe(() => {
          this.router.navigate(['/login']);
        });
    });
  }

  #addRegisterControls() {
    this.authForm.addControl(
      'name',
      new FormControl('', [Validators.required])
    );
    this.authForm.addControl('repeatPassword', new FormControl(''));
    this.authForm.addValidators(
      repeatPasswordValidator(
        this.authForm.controls['password'],
        this.authForm.controls['repeatPassword']
      )
    );
  }
}
