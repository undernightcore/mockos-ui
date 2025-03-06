import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '../../components/button/button.module';
import { AutoAnimateModule } from 'src/app/directives/auto-animate/auto-animate.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NavbarModule,
    MatButtonModule,
    TranslateModule,
    ButtonModule,
    AutoAnimateModule
  ],
})
export class HomeModule {}
