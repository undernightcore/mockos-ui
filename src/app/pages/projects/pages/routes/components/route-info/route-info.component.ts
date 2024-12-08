import { Component } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';
import { debounce, defer, delayWhen, of, switchMap, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateResponseComponent } from '../create-response/create-response.component';
import { ResponsesService } from 'src/app/services/responses/responses.service';

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

  constructor(
    private projectManager: ProjectManagerService,
    private dialogService: MatDialog,
    private responsesService: ResponsesService
  ) {}

  openCreateResponse(routeId: number, responseId?: number) {
    defer(() =>
      responseId !== undefined
        ? this.responsesService.getResponse(responseId)
        : of(undefined)
    )
      .pipe(
        switchMap((responseData) =>
          this.dialogService
            .open(CreateResponseComponent, {
              closeOnNavigation: true,
              height: '90%',
              width: '70%',
              data: { routeId, responseData },
              panelClass: 'mobile-fullscreen',
              autoFocus: false,
            })
            .afterClosed()
        )
      )
      .subscribe();
  }
}
