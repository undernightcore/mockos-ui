import { Component, OnInit } from '@angular/core';
import { ProjectManagerService } from '../../services/project.manager';
import {
  debounceTime,
  firstValueFrom,
  map,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
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

  temporalSorting$ = new Subject<{ from: number; to: number }>();
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
                      .includes(search.toLowerCase())
                  : route.name.toLowerCase().includes(search.toLowerCase())
              )
            : routes
        ),
        switchMap((routes) =>
          this.temporalSorting$.pipe(
            startWith(undefined),
            tap(
              (sorting) =>
                routes &&
                sorting &&
                moveItemInArray(routes, sorting.from, sorting.to)
            ),
            map(() => routes)
          )
        )
      )
    )
  );
  selectedRoute$ = this.projectManager.selectedRoute$;

  constructor(private projectManager: ProjectManagerService) {}

  async handleDrop(event: CdkDragDrop<any, any, any>) {
    const routes = await firstValueFrom(this.routes$);

    if (!routes) return;

    const from = routes[event.previousIndex];
    const to = routes[event.currentIndex];

    this.temporalSorting$.next({
      from: event.previousIndex,
      to: event.currentIndex,
    });

    this.projectManager.sortRoute(
      from.is_folder ? from.folder.id : from.id,
      to.is_folder ? to.folder.id : to.id
    );
  }

  selectRoute(routeId: number) {
    this.projectManager.selectRoute(routeId);
  }

  trackByRoute(_: number, route: RouteInterface | FolderAndRoutesInterface) {
    return route.is_folder ? route.folder.id : route.id;
  }
}
