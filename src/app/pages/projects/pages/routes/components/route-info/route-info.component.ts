import { Component } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';
import { debounce, delayWhen, timer } from 'rxjs';

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

  constructor(private projectManager: ProjectManagerService) {}
}
