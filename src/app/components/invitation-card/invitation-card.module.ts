import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationCardComponent } from './invitation-card.component';
import { ButtonModule } from '../button/button.module';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, ButtonModule, RouterLink, TranslateModule],
  declarations: [InvitationCardComponent],
  exports: [InvitationCardComponent],
})
export class InvitationCardModule {}
