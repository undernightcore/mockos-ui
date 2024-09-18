import { Component, OnInit } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
})
export class RouteListComponent {
  routes$ = this.projectManager.folderAndRoutes$;

  constructor(private projectManager: ProjectManagerService) {}
}
