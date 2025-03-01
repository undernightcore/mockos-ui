import { Component } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';
import {
  catchError,
  debounce,
  defer,
  delayWhen,
  of,
  switchMap,
  timer,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateResponseComponent } from '../create-response/create-response.component';
import { ResponsesService } from 'src/app/services/responses/responses.service';
import { LiveMockComponent } from '../live-mock/live-mock.component';

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

  openLiveMock(responseId: number) {
    this.responsesService
      .getProcessor(responseId)
      .pipe(
        catchError(() => of(undefined)),
        switchMap((processor) =>
          this.dialogService
            .open(LiveMockComponent, {
              closeOnNavigation: true,
              height: '90%',
              width: '70%',
              data: { responseId, processor },
              panelClass: 'mobile-fullscreen',
              autoFocus: false,
            })
            .afterClosed()
        )
      )
      .subscribe();
  }

  enableResponse(responseId: number) {
    this.responsesService.enableResponse(responseId).subscribe({
      next: (value) => {},
      error: (error) => {},
    });
  }
}
