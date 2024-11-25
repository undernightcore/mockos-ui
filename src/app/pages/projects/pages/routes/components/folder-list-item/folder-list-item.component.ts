import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FolderAndRoutesInterface } from '../../interfaces/folder-and-routes.interface';
import { ReplaySubject, shareReplay } from 'rxjs';
import {
  FolderInterface,
  RouteInterface,
} from 'src/app/interfaces/route.interface';
import { ProjectManagerService } from '../../services/project.manager';
import { FormControl } from '@angular/forms';
import { CreateRouteInterface } from 'src/app/interfaces/create-route.interface';
import { CreateFolderInterface } from 'src/app/interfaces/create-folder.interface';

@Component({
  selector: 'app-folder-list-item',
  templateUrl: './folder-list-item.component.html',
  styleUrls: ['./folder-list-item.component.scss'],
})
export class FolderListItemComponent {
  @Input() set folder(value: FolderAndRoutesInterface) {
    this.folder$.next(value.folder);
    this.routes$.next(value.routes);
  }

  routes$ = new ReplaySubject<RouteInterface[]>(1);

  selectedRoute$ = this.projectManager.selectedRoute$.pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  folder$ = new ReplaySubject<FolderInterface>(1);

  opened = false;

  constructor(private projectManager: ProjectManagerService) {}

  openEditFolderModal(id: number, data: CreateFolderInterface) {
    this.projectManager.openEditRouteModal(id, true, data).subscribe();
  }

  selectRoute(routeId: number) {
    this.projectManager.selectRoute(routeId);
  }

  trackByRoute(_: number, route: RouteInterface) {
    return route.id;
  }
}
