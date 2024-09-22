import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
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
        startWith('updated'),
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
  route$ = this.#selectedRoute.pipe(
    switchMap((selected) =>
      this.routes$.pipe(
        map((routes) => routes?.find((route) => route.id === selected))
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  responses$ = this.route$.pipe(
    distinctUntilChanged((previous, current) => previous?.id === current?.id),
    switchMap((route) =>
      route
        ? this.realtimeService.listenRoute(route.id).pipe(
            startWith('updated'),
            switchMap((status) =>
              status !== 'deleted'
                ? this.responsesService.getResponses(route.id)
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
    private router: Router
  ) {}

  selectRoute(routeId: number) {
    this.#selectedRoute.next(routeId);
  }

  sortRoute(fromId: number, toId: number) {
    this.project$
      .pipe(
        take(1),
        switchMap((project) =>
          this.routesService.sortRoute(project.id, fromId, toId)
        )
      )
      .subscribe();
  }

  selectProject(projectId: number) {
    this.#selectedProject.next(projectId);
  }

  #setHeader(project: ProjectInterface) {
    this.appManager.setHeaderData({
      hideHeader: false,
      breadcrumb: [{ label: 'Inicio', link: '/' }, { label: project.name }],
    });
  }
}
