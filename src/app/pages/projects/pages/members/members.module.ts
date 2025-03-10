import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';
import { NavbarModule } from '../../../../components/navbar/navbar.module';
import { TranslateModule } from '@ngx-translate/core';
import { MemberCardComponent } from './components/member-card/member-card.component';
import { InviteModalComponent } from './components/invite-modal/invite-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InfiniteScrollModule } from '../../../../directives/infinite-scroll/infinite-scroll.module';
import { ChoiceModalModule } from '../../../../components/choice-modal/choice-modal.module';
import { ButtonModule } from 'src/app/components/button/button.module';
import { InputModule } from 'src/app/components/input/input.module';
import { DialogModule } from 'src/app/components/dialog/dialog.module';

@NgModule({
  declarations: [MembersComponent, MemberCardComponent, InviteModalComponent],
  imports: [
    CommonModule,
    MembersRoutingModule,
    NavbarModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    InfiniteScrollModule,
    ChoiceModalModule,
    MatButtonModule,
    ButtonModule,
    DialogModule,
    InputModule
  ],
})
export class MembersModule {}
