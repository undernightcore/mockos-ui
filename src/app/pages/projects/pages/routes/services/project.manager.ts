import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  defer,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  ReplaySubject,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ProjectInterface } from 'src/app/interfaces/project.interface';
import { AppManagerService } from 'src/app/services/app/app-manager.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { RealtimeService } from 'src/app/services/realtime/realtime.service';
import { ResponsesService } from 'src/app/services/responses/responses.service';
import { RoutesService } from 'src/app/services/routes/routes.service';
import { mapRoutesToFolders } from '../mappers/routes-to-folders.mapper';
import { CreateFolderInterface } from 'src/app/interfaces/create-folder.interface';
import { CreateRouteInterface } from 'src/app/interfaces/create-route.interface';
import {
  FolderInterface,
  RouteInterface,
} from 'src/app/interfaces/route.interface';
import { MatDialog } from '@angular/material/dialog';
import { CreateRouteComponent } from '../components/create-route/create-route.component';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { ChoiceModalComponent } from 'src/app/components/choice-modal/choice-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ImportSwaggerComponent } from '../components/import-swagger/import-swagger.component';

@Injectable({
  providedIn: 'root',
})
export class ProjectManagerService {
  #selectedProject = new ReplaySubject<number>(1);
  project$ = this.#selectedProject.pipe(
    switchMap((projectId) =>
      this.projectsService
        .getProject(Number(projectId))
        .pipe(tap((project) => this.#setHeader(project)))
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  routes$ = this.project$.pipe(
    switchMap((project) =>
      this.realtimeService.listenProject(project.id).pipe(
        startWith('started'),
        switchMap((status) =>
          status !== 'deleted'
            ? this.routesService.getRoutes(project.id)
            : of(undefined).pipe(tap(() => this.router.navigate(['/'])))
        )
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  folderAndRoutes$ = this.routes$.pipe(
    map((routes) => (routes ? mapRoutesToFolders(routes) : undefined)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  #selectedRoute = new Subject<number>();
  selectedRoute$ = this.#selectedRoute.asObservable();
  route$ = this.#selectedRoute.pipe(
    switchMap((selected) =>
      this.routes$.pipe(
        map((routes) => routes?.find((route) => route.id === selected))
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  #loadingResponses = new BehaviorSubject(0);
  loadingResponses$ = this.#loadingResponses.pipe(
    map((amount) => Boolean(amount))
  );
  responses$ = this.route$.pipe(
    distinctUntilChanged((previous, current) => previous?.id === current?.id),
    switchMap((route) =>
      route
        ? this.realtimeService.listenRoute(route.id).pipe(
            startWith('started'),
            switchMap((status) =>
              status !== 'deleted'
                ? this.responsesService.getResponses(route.id).pipe(
                    tap({
                      subscribe: () =>
                        this.#loadingResponses.next(
                          this.#loadingResponses.value + 1
                        ),
                      finalize: () =>
                        this.#loadingResponses.next(
                          this.#loadingResponses.value - 1
                        ),
                    })
                  )
                : of(undefined)
            )
          )
        : of(undefined)
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(
    private projectsService: ProjectService,
    private appManager: AppManagerService,
    private routesService: RoutesService,
    private responsesService: ResponsesService,
    private realtimeService: RealtimeService,
    private router: Router,
    private dialogService: MatDialog,
    private translateService: TranslateService
  ) {}

  selectRoute(routeId: number) {
    this.#selectedRoute.next(routeId);
  }

  moveRoute(whatId: string, beforeId?: string, intoId?: string) {
    return this.project$.pipe(
      take(1),
      switchMap((project) =>
        this.routesService.sortAndMoveRoute(
          project.id,
          Number(whatId),
          beforeId ? Number(beforeId) : undefined,
          intoId ? Number(intoId) : undefined
        )
      )
    );
  }

  selectProject(projectId: number) {
    this.#selectedProject.next(projectId);
  }

  openCreateRouteModal(
    folder: boolean,
    data?: CreateFolderInterface | CreateRouteInterface
  ): Observable<RouteInterface> {
    return this.dialogService
      .open(CreateRouteComponent, {
        data: { isFolder: folder, data },
        minWidth: 450,
      })
      .afterClosed()
      .pipe(
        filter((response) => Boolean(response)),
        switchMap((value) =>
          this.project$.pipe(
            take(1),
            switchMap((project) =>
              defer(() =>
                folder
                  ? this.routesService.createFolder(project.id, value)
                  : this.routesService.createRoute(project.id, {
                      ...value,
                      parentFolderId: null,
                    })
              ).pipe(
                catchError((error) =>
                  this.dialogService
                    .open(ConfirmModalComponent, {
                      data: {
                        title: 'Error',
                        message:
                          error?.error?.errors?.[0] ?? 'Error inesperado',
                        label: 'Aceptar',
                        type: 'destructive',
                      },
                    })
                    .afterClosed()
                    .pipe(
                      switchMap(() => this.openCreateRouteModal(folder, value))
                    )
                )
              )
            )
          )
        )
      );
  }

  openEditRouteModal(
    id: number,
    folder: boolean,
    data: CreateFolderInterface | CreateRouteInterface
  ): Observable<RouteInterface> {
    return this.dialogService
      .open(CreateRouteComponent, {
        data: { isFolder: folder, data },
        minWidth: 450,
      })
      .afterClosed()
      .pipe(
        filter((response) => Boolean(response)),
        switchMap((value) =>
          defer(() =>
            folder
              ? this.routesService.editFolder(id, value)
              : this.routesService.editRoute(id, value)
          ).pipe(
            catchError((error) =>
              this.dialogService
                .open(ConfirmModalComponent, {
                  data: {
                    title: 'Error',
                    message: error?.error?.errors?.[0] ?? 'Error inesperado',
                    label: 'Aceptar',
                    type: 'destructive',
                  },
                })
                .afterClosed()
                .pipe(
                  switchMap(() => this.openEditRouteModal(id, folder, value))
                )
            )
          )
        )
      );
  }

  openImportSwaggerModal() {
    return this.project$.pipe(
      take(1),
      switchMap(project => {
        return this.dialogService
          .open(ImportSwaggerComponent, {
            closeOnNavigation: true,
            height: '90%',
            width: '70%',
            data: {  projectId: project.id },
            panelClass: 'mobile-fullscreen',
            autoFocus: false,
          })
          .afterClosed();
      })
    );
  }
  openDeleteRouteModal(route: RouteInterface | FolderInterface) {
    return this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(
            route.is_folder
              ? `PAGES.ROUTES.DELETE_FOLDER_TITLE`
              : `PAGES.ROUTES.DELETE_ROUTE_TITLE`
          ),
          message: this.translateService.instant(
            route.is_folder
              ? `PAGES.ROUTES.DELETE_FOLDER_MESSAGE`
              : `PAGES.ROUTES.DELETE_ROUTE_MESSAGE`,
            {
              name: route.name,
            }
          ),
          type: 'destructive',
          confirmLabel: this.translateService.instant('ACTIONS.DELETE'),
        },
        autoFocus: false,
        minWidth: '450px',
        maxWidth: '650px',
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.routesService.deleteRoute(route.id))
      );
  }

  #setHeader(project: ProjectInterface) {
    this.appManager.setHeaderData({
      hideHeader: false,
      breadcrumb: [{ label: 'Inicio', link: '/' }, { label: project.name }],
    });
  }
}
