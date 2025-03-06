import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from '../dialog/dialog.module';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [ConfirmModalComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    DialogModule,
    ButtonModule,
  ],
  exports: [ConfirmModalComponent],
})
export class ConfirmModalModule {}
