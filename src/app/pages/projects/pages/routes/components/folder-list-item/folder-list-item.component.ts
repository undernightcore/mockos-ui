import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FolderAndRoutesInterface } from '../../interfaces/folder-and-routes.interface';
import { ReplaySubject, shareReplay } from 'rxjs';
import {
  FolderInterface,
  RouteInterface,
} from 'src/app/interfaces/route.interface';
import { ProjectManagerService } from '../../services/project.manager';
import { FormControl } from '@angular/forms';

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

  @Input() sortingMode = false;

  @Output() dropping = new EventEmitter<boolean>();

  checkedForm = new FormControl(true, (control) => {
    if (!control.value) control.setValue(true);
    return null;
  });

  routes$ = new ReplaySubject<RouteInterface[]>(1);
  selectedRoutes$ = this.projectManager.selectedRoutes$;
  selectedRoute$ = this.projectManager.selectedRoute$.pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  folder$ = new ReplaySubject<FolderInterface>(1);

  opened = false;

  constructor(private projectManager: ProjectManagerService) {}

  handleChecked(routeId: number, checked: boolean) {
    if (checked) {
      this.projectManager.addRouteToList(routeId);
    } else {
      this.projectManager.removeRouteFromList(routeId);
    }
  }

  selectRoute(routeId: number) {
    this.projectManager.selectRoute(routeId);
  }

  trackByRoute(_: number, route: RouteInterface) {
    return route.id;
  }
}
