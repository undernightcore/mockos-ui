import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  defer,
  delayWhen,
  filter,
  map,
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
import { EditHeadersResponseComponent } from '../edit-headers-response/edit-headers-response.component';
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
    startWith(false),
    delayWhen((loading) => (loading ? timer(0) : timer(200)))
  );

  selectedResponseIdsSubject = new BehaviorSubject<Set<number>>(new Set());
  selectedResponseIds$ = this.selectedResponseIdsSubject
    .asObservable()
    .pipe(map((set) => Array.from(set)));

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

  openDeleteSelectedResponses() {
    const selectedIds = Array.from(this.selectedResponseIdsSubject.value);
    if (selectedIds.length === 0) return;

    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(`PAGES.ROUTES.DELETE_RESPONSE`),
          message: this.translateService.instant(
            `PAGES.ROUTES.DELETE_SELECTED_RESPONSES_MESSAGE`
          ),
          type: 'destructive',
          confirmLabel: this.translateService.instant('ACTIONS.DELETE'),
        },
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() =>
          this.responsesService.deleteSelectedResponses(selectedIds)
        )
      )
      .subscribe(() => {
        this.selectedResponseIdsSubject.next(new Set());
      });
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

  selectItem(responseId: number) {
    const currentSet = new Set(this.selectedResponseIdsSubject.value);
    if (currentSet.has(responseId)) {
      currentSet.delete(responseId);
    } else {
      currentSet.add(responseId);
    }
    this.selectedResponseIdsSubject.next(currentSet);
  }
}
