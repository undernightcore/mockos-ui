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

  constructor(
    private projectManager: ProjectManagerService
  ) {}

  openCreateRouteModal(
    folder: boolean,
    data?: CreateFolderInterface | CreateRouteInterface
  ) {
    return this.projectManager.openCreateRouteModal(folder, data);
  }

  openEditRouteModal(
    id: number,
    folder: boolean,
    data: CreateFolderInterface | CreateRouteInterface
  ): Observable<RouteInterface> {
    return this.projectManager.openEditRouteModal(id, folder, data);
  }

  openImportSwaggerModal(item: RouteInterface | FolderInterface) {
    return this.projectManager.openImportSwaggerModal(item);
  }

  openDeleteRouteModal(item: RouteInterface | FolderInterface) {
   return this.projectManager.openDeleteRouteModal(item)
  }
}
