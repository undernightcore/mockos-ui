import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmModalModule } from '../../components/confirm-modal/confirm-modal.module';
import { InputModule } from '../../components/input/input.module';
import { ButtonModule } from '../../components/button/button.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    NavbarModule,
    TranslateModule,
    ConfirmModalModule,
    InputModule,
    ButtonModule,
  ],
})
export class AuthModule {}
