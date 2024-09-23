import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FolderAndRoutesInterface } from '../../interfaces/folder-and-routes.interface';
import {
  firstValueFrom,
  map,
  ReplaySubject,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  FolderInterface,
  RouteInterface,
} from 'src/app/interfaces/route.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
    this.#routes.next(value.routes);
  }

  @Input() sortingMode = false;

  @Output() draggingStart = new EventEmitter();
  @Output() draggingEnd = new EventEmitter();

  isDropping = false;
  @Output() dropping = new EventEmitter<boolean>();

  checkedForm = new FormControl(true, (control) => {
    if (!control.value) control.setValue(true);
    return null;
  });

  temporalSorting$ = new Subject<{ from: number; to: number }>();
  #routes = new ReplaySubject<RouteInterface[]>(1);
  routes$ = this.#routes.pipe(
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
  );
  selectedRoute$ = this.projectManager.selectedRoute$.pipe(shareReplay({ refCount: true, bufferSize: 1}));

  folder$ = new ReplaySubject<FolderInterface>(1);

  opened = false;

  constructor(private projectManager: ProjectManagerService) {}

  draggingInside(enter: boolean) {
    if (!this.sortingMode) return;
    this.isDropping = enter;
    this.dropping.emit(enter);
  }

  async handleDrop(event: CdkDragDrop<any, any, any>) {
    const routes = await firstValueFrom(this.routes$);

    if (!routes) return;

    const from = routes[event.previousIndex];
    const to = routes[event.currentIndex];

    this.temporalSorting$.next({
      from: event.previousIndex,
      to: event.currentIndex,
    });

    this.projectManager.sortRoute(from.id, to.id);
  }

  selectRoute(routeId: number) {
    this.projectManager.selectRoute(routeId);
  }

  trackByRoute(_: number, route: RouteInterface) {
    return route.id;
  }
}
