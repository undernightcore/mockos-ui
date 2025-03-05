import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  defer,
  delayWhen,
  filter,
  of,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { SimpleResponseInterface } from 'src/app/interfaces/response.interface';
import { ResponsesService } from 'src/app/services/responses/responses.service';
import { ChoiceModalComponent } from '../../../../../../components/choice-modal/choice-modal.component';
import { ProjectManagerService } from '../../services/project.manager';
import { CreateResponseComponent } from '../create-response/create-response.component';
import { DuplicateResponseComponent } from '../duplicate-response/duplicate-response.component';
import { LiveMockComponent } from '../live-mock/live-mock.component';
import {HeadersModalComponent} from "../../../../../../components/headers-modal/headers-modal.component";

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
    startWith(false),
    delayWhen((loading) => (loading ? timer(0) : timer(200)))
  );

  constructor(
    private projectManager: ProjectManagerService,
    private dialogService: MatDialog,
    private responsesService: ResponsesService,
    private translateService: TranslateService
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

  openLiveMock(response: SimpleResponseInterface) {
    this.dialogService
      .open(LiveMockComponent, {
        closeOnNavigation: true,
        height: '90%',
        width: '70%',
        data: { responseId: response.id, processor: response.processor },
        panelClass: 'mobile-fullscreen',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe();
  }

  openDeleteResponse(responseId: number) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(`PAGES.ROUTES.DELETE_RESPONSE`),
          message: this.translateService.instant(
            `PAGES.ROUTES.DELETE_RESPONSE_MESSAGE`
          ),
          type: 'destructive',
          confirmLabel: this.translateService.instant('ACTIONS.DELETE'),
        },
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.responsesService.deleteResponse(responseId))
      )
      .subscribe();
  }

  openHeaders(responseId: number) {
    this.dialogService
      .open(HeadersModalComponent, {
        closeOnNavigation: true,
        width: '861px',
        height: '500px',
        data: responseId,
        panelClass: 'mobile-fullscreen',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(filter((confirmed) => confirmed))
      .subscribe();
  }

  openDuplicateResponse(responseId: number) {
    this.dialogService
      .open(DuplicateResponseComponent, {
        closeOnNavigation: true,
        data: responseId,
        panelClass: 'mobile-fullscreen',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(filter((confirmed) => confirmed))
      .subscribe();
  }

  enableResponse(responseId: number) {
    this.responsesService.enableResponse(responseId).subscribe({
      next: (value) => {},
      error: (error) => {},
    });
  }
}
