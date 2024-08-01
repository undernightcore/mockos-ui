import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoiceModalComponent } from './choice-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '../dialog/dialog.module';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [ChoiceModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
  ],
  exports: [ChoiceModalComponent],
})
export class ChoiceModalModule {}
