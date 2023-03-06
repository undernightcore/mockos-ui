import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ChoiceModalModule } from '../../components/choice-modal/choice-modal.module';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectCardComponent,
    ProjectModalComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NavbarModule,
    ScrollingModule,
    TranslateModule,
    MatIconModule,
    ChoiceModalModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class DashboardModule {}
