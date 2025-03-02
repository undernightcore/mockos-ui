import { Component } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';
import {
  combineLatestWith,
  defer,
  delayWhen,
  filter,
  map,
  of,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateResponseComponent } from '../create-response/create-response.component';
import { ResponsesService } from 'src/app/services/responses/responses.service';
import { LiveMockComponent } from '../live-mock/live-mock.component';
import { toMap } from '../../../../../../utils/object.utils';
import { SimpleResponseWithProcessorInterface } from '../../../../../../interfaces/response.interface';
import { ChoiceModalComponent } from '../../../../../../components/choice-modal/choice-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { EditHeadersResponseComponent } from '../edit-headers-response/edit-headers-response.component';
import { DuplicateResponseComponent } from '../duplicate-response/duplicate-response.component';

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.scss'],
})
export class RouteInfoComponent {
  routes$ = this.projectManager.routes$;
  route$ = this.projectManager.route$;
  processors$ = this.projectManager.processors$;

  responses$ = this.projectManager.responses$.pipe(
    combineLatestWith(this.processors$),
    map(([responses, processors]) => {
      if (!processors || !responses) return [];

      const processorsByResponseId = toMap(
        processors,
        (processor) => processor.responseId
      );

      return responses.map((response) => ({
        ...response,
        processor: processorsByResponseId.get(response.id),
      })) as SimpleResponseWithProcessorInterface[];
    })
  );

  loadingResponses$ = this.projectManager.loadingResponses$.pipe(
    startWith(false),
    combineLatestWith(
      this.projectManager.loadingProcessors$.pipe(startWith(false))
    ),
    map(
      ([loadingResponses, loadingProcessors]) =>
        loadingResponses || loadingProcessors
    ),
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

  openLiveMock(response: SimpleResponseWithProcessorInterface) {
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
      .open(EditHeadersResponseComponent, {
        closeOnNavigation: true,
        height: '90%',
        width: '70%',
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
