import { Component } from '@angular/core';
import { ProjectManagerService } from './services/project.manager';
import { ActivatedRoute } from '@angular/router';
import { filter, map, take, tap } from 'rxjs';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectManager: ProjectManagerService
  ) {
    this.#initializeProject();
  }

  #initializeProject() {
    this.activatedRoute.paramMap.pipe(
      take(1),
      map((params) => params.get('id')),
      filter((projectId) => Boolean(projectId)),
      map((projectId) => Number(projectId)),
      tap((projectId) => this.projectManager.selectProject(projectId))
    ).subscribe()
  }
}
