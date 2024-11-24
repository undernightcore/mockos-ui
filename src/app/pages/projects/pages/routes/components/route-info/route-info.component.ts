import { Component } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';
import { debounce, delayWhen, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateResponseComponent } from '../create-response/create-response.component';

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.scss'],
})
export class RouteInfoComponent {

  routes$ = this.projectManager.routes$;
  route$ = this.projectManager.route$;

  responses$ = this.projectManager.responses$;
  loadingResponses$ = this.projectManager.loadingResponses$.pipe(
    delayWhen((loading) => (loading ? timer(0) : timer(200)))
  );

  constructor(private projectManager: ProjectManagerService, private dialogService: MatDialog) {}

  openCreateResponse(routeId: number) {
    this.dialogService.open(CreateResponseComponent, { data: { routeId }})
  }
}
