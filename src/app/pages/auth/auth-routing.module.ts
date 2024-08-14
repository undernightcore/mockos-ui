import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LandingGuard } from '../../guards/landing.guard';

const routes: Routes = [
  {
    path: 'login',
    data: { newUser: false },
    component: AuthComponent,
    canActivate: [LandingGuard],
  },
  {
    path: 'register',
    data: { newUser: true },
    component: AuthComponent,
    canActivate: [LandingGuard],
  },
  {
    path: '**',
    loadChildren: () =>
      import('../not-found/not-found.module').then((m) => m.NotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
