import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CdkMenuModule } from '@angular/cdk/menu';
import { InvitationCardModule } from '../invitation-card/invitation-card.module';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterLink,
    MatButtonModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    CdkMenuModule,
    InvitationCardModule,
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {}
