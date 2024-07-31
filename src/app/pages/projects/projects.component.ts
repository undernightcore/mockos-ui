import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { ForkedProjectInterface } from '../../interfaces/project.interface';
import {
  distinctUntilChanged,
  exhaustMap,
  filter,
  finalize,
  iif,
  map,
  Observable,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { ChoiceModalComponent } from '../../components/choice-modal/choice-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { openToast } from '../../utils/toast.utils';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { CreateProjectInterface } from '../../interfaces/create-project.interface';
import { InvitationsService } from '../../services/invitations/invitations.service';
import { Router } from '@angular/router';
import { AppManagerService } from '../../services/app/app-manager.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  invitations$ = this.invitationsService
    .getInvitations(1, 1)
    .pipe(map((invitation) => invitation.meta.total));

  triggerNewPage$ = new Subject<number>();
  projects$: Observable<{ projects: ForkedProjectInterface[]; total: number }> =
    this.triggerNewPage$.pipe(
      startWith(1),
      distinctUntilChanged(
        (previous, current) => previous === current && current !== 1
      ),
      switchMap((page) => this.projectService.getProjects(page, 20)),
      scan(
        (acc, value) => ({
          projects: value.meta.current_page !== 1
            ? [...acc.projects, ...value.data]
            : value.data,
          total: value.meta.total,
        }),
        { projects: [], total: 0 } as {
          projects: ForkedProjectInterface[];
          total: number;
        }
      ),
      shareReplay(1)
    );

  selectedProjects = new Set<number>();

  constructor(
    private appManager: AppManagerService,
    private projectService: ProjectService,
    private dialogService: MatDialog,
    private translateService: TranslateService,
    private invitationsService: InvitationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.appManager.setHeaderData({
      breadcrumb: [{ label: 'PAGES.HOME.TITLE' }],
    });
  }

  openDeleteModal(project: ForkedProjectInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(
            'PAGES.DASHBOARD.DELETE_PROJECT',
            { project: project.name }
          ),
          message: this.translateService.instant(
            'PAGES.DASHBOARD.DELETE_PROJECT_MESSAGE',
            { project: project.name }
          ),
        },
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.projectService.deleteProject(project.id))
      )
      .subscribe((message) => {
        openToast(message.message, 'success');
        this.triggerNewPage$.next(1);
      });
  }

  openCreateModal(project?: ForkedProjectInterface) {
    this.dialogService
      .open(ProjectModalComponent, { data: { project }, autoFocus: false })
      .afterClosed()
      .pipe(
        filter((data) => Boolean(data)),
        switchMap((data) =>
          iif(
            () => !project,
            this.projectService.createProject(data),
            this.projectService.editProject(project?.id as number, data)
          )
        )
      )
      .subscribe((response) => {
        openToast(
          this.translateService.instant(
            !project
              ? 'PAGES.DASHBOARD.PROJECT_CREATED'
              : 'PAGES.DASHBOARD.PROJECT_EDITED',
            {
              project: response.name,
            }
          ),
          'success'
        );
        this.triggerNewPage$.next(1);
      });
  }

  openContractPage(project: ForkedProjectInterface) {
    this.router.navigate(['/projects', project?.id, 'contracts']);
  }
}
