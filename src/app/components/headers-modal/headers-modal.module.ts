import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersModalComponent } from './headers-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from '../dialog/dialog.module';
import { ButtonModule } from '../button/button.module';
import {InputModule} from "../input/input.module";
import {HeaderModule} from "./components/header.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {InfiniteScrollModule} from "../../directives/infinite-scroll/infinite-scroll.module";

@NgModule({
  declarations: [HeadersModalComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    DialogModule,
    ButtonModule,
    InputModule,
    HeaderModule,
    ReactiveFormsModule,
    TranslateModule,
    InfiniteScrollModule,
  ],
  exports: [HeadersModalComponent],
})
export class HeadersModalModule {}
