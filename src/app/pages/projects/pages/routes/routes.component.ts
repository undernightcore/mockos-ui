import { Component, OnDestroy } from '@angular/core';
import { ProjectManagerService } from './services/project.manager';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnDestroy {
  subscriptions$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectManager: ProjectManagerService,
    private dragulaService: DragulaService
  ) {
    this.#initializeProject();
    this.#initializeDragula();
  }

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();

    this.dragulaService.destroy('routes');
  }

  #initializeProject() {
    this.activatedRoute.paramMap
      .pipe(
        take(1),
        map((params) => params.get('id')),
        filter((projectId) => Boolean(projectId)),
        map((projectId) => Number(projectId)),
        tap((projectId) => this.projectManager.selectProject(projectId))
      )
      .subscribe();
  }

  #initializeDragula() {
    this.dragulaService.createGroup('routes', {
      accepts: (item, target) =>
        item?.tagName.toLowerCase() !== 'app-folder-list-item' ||
        !target?.classList.contains('folder-list-item__routes'),
    });

    this.dragulaService
      .drop('routes')
      .pipe(
        takeUntil(this.subscriptions$),
        map(({ el, sibling, target }) => ({
          what: el?.getAttribute('data-id') ?? undefined,
          before: sibling?.getAttribute('data-id') ?? undefined,
          into: target?.getAttribute('data-id') ?? undefined,
        })),
        filter(
          (
            move
          ): move is {
            what: string;
            before: string | undefined;
            into: string | undefined;
          } => Boolean(move.what)
        ),
        switchMap((move) =>
          this.projectManager.moveRoute(move.what, move.before, move.into)
        )
      )
      .subscribe();
  }
}
