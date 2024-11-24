import { Component } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';
import { debounceTime, map, startWith, Subject, switchMap, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RoutesService } from 'src/app/services/routes/routes.service';
import { RouteInterface } from 'src/app/interfaces/route.interface';
import { FolderAndRoutesInterface } from '../../interfaces/folder-and-routes.interface';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
})
export class RouteListComponent {
  searchForm = new FormControl<string>('');

  selectedRoutes$ = this.projectManager.selectedRoutes$;
  routes$ = this.searchForm.valueChanges.pipe(
    debounceTime(200),
    startWith(this.searchForm.value),
    switchMap((search) =>
      this.projectManager.folderAndRoutes$.pipe(
        map((routes) =>
          search
            ? routes?.filter((route) =>
                route.is_folder
                  ? route.folder.name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    route.routes.some((child) =>
                      child.name.toLowerCase().includes(search.toLowerCase())
                    )
                  : route.name.toLowerCase().includes(search.toLowerCase())
              )
            : routes
        )
      )
    )
  );
  selectedRoute$ = this.projectManager.selectedRoute$;

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

  trackByRoute(_: number, route: RouteInterface | FolderAndRoutesInterface) {
    return route.is_folder ? route.folder.id : route.id;
  }
}
