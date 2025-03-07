import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./pages/routes/routes.module').then((m) => m.RoutesModule),
  },
  {
    path: ':id/members',
    loadChildren: () =>
      import('./pages/members/members.module').then((m) => m.MembersModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
