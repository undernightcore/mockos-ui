import { Component } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';
import {
  catchError,
  defer,
  filter,
  map,
  Observable,
  retry,
  retryWhen,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateRouteComponent } from '../create-route/create-route.component';
import {
  FolderInterface,
  RouteInterface,
} from 'src/app/interfaces/route.interface';
import { RoutesService } from 'src/app/services/routes/routes.service';
import { CreateFolderInterface } from 'src/app/interfaces/create-folder.interface';
import { CreateRouteInterface } from 'src/app/interfaces/create-route.interface';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-route-actions',
  templateUrl: './route-actions.component.html',
  styleUrls: ['./route-actions.component.scss'],
})
export class RouteActionsComponent {
  selectedRoute$ = this.projectManager.route$.pipe(startWith(undefined));

  routesToDelete$ = this.projectManager.selectedRoutes$;

  constructor(
    private projectManager: ProjectManagerService,
    private routesService: RoutesService,
    private dialogService: MatDialog
  ) {}

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
          this.projectManager.project$.pipe(
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
}
