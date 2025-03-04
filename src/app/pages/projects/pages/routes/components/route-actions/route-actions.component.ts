import { Component } from '@angular/core';
import { Observable, startWith } from 'rxjs';
import { CreateFolderInterface } from 'src/app/interfaces/create-folder.interface';
import { CreateRouteInterface } from 'src/app/interfaces/create-route.interface';
import {
  FolderInterface,
  RouteInterface,
} from 'src/app/interfaces/route.interface';
import { ProjectManagerService } from '../../services/project.manager';

@Component({
  selector: 'app-route-actions',
  templateUrl: './route-actions.component.html',
  styleUrls: ['./route-actions.component.scss'],
})
export class RouteActionsComponent {
  selectedRoute$ = this.projectManager.route$.pipe(startWith(undefined));

  constructor(private projectManager: ProjectManagerService) {}

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

  openImportSwaggerModal() {
    return this.projectManager.openImportSwaggerModal();
  }

  openTokensModal() {
    return this.projectManager.openTokensModal();
  }

  openDeleteRouteModal(item: RouteInterface | FolderInterface) {
    return this.projectManager.openDeleteRouteModal(item);
  }
}
