import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  catchError,
  EMPTY,
  filter,
  finalize,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AppManagerService } from 'src/app/services/app/app-manager.service';
import { ChoiceModalComponent } from '../../../../components/choice-modal/choice-modal.component';
import { MemberInterface } from '../../../../interfaces/member.interface';
import { ProjectInterface } from '../../../../interfaces/project.interface';
import { ProjectService } from '../../../../services/project/project.service';
import { openToast } from '../../../../utils/toast.utils';
import { InviteModalComponent } from './components/invite-modal/invite-modal.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  projectId?: number;
  project?: ProjectInterface;
  members?: MemberInterface[];
  maxMembers = 0;
  #isFetching = false;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private dialogService: MatDialog,
    private router: Router,
    private translateService: TranslateService,
    private appManager: AppManagerService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'] ? Number(params['id']) : undefined;
      this.#getProject();
    });
  }

  openInviteModal(email?: string) {
    if (!this.projectId) return;

    this.dialogService
      .open(InviteModalComponent, {
        width: '500px',
        data: email,
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        take(1),
        switchMap((newEmail: string) =>
          this.projectService.inviteToProject(this.projectId!, newEmail).pipe(
            tap((message) => {
              openToast(message.message, 'success');
              this.#getProject();
            }),
            catchError(() => {
              openToast(
                this.translateService.instant('ERRORS.USER_NOT_EXIST'),
                'error'
              );
              this.openInviteModal(newEmail);
              return EMPTY;
            })
          )
        )
      )
      .subscribe();
  }

  openLeaveModal() {
    if (!this.projectId) return;
    const title = this.translateService.instant(
      'PAGES.MEMBERS.LEAVE_PROJECT_TITLE'
    );
    const message = this.translateService.instant(
      'PAGES.MEMBERS.LEAVE_PROJECT_MESSAGE'
    );
    this.dialogService
      .open(ChoiceModalComponent, {
        data: { title, message },
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((leave) => {
        if (!leave) return;
        this.projectService
          .leaveProject(this.projectId!)
          .subscribe((message) => {
            openToast(message.message, 'success');
            this.router.navigate(['/projects']);
          });
      });
  }

  #getProject() {
    if (this.projectId === undefined) return;
    this.projectService.getProject(this.projectId).subscribe((project) => {
      this.project = project;
      this.getMemberList(1);
      this.appManager.setHeaderData({
        hideHeader: false,
        breadcrumb: [
          {
            label: this.translateService.instant('PAGES.HOME.TITLE'),
            link: '/',
          },
          { label: this.project.name, link: `/projects/${this.project.id}` },
          { label: 'Miembros' },
        ],
      });
    });
  }

  getMemberList(page: number) {
    if (this.#isFetching || this.projectId === undefined) return;
    this.#isFetching = true;
    this.projectService
      .getMemberList(this.projectId, page, 20)
      .pipe(finalize(() => (this.#isFetching = false)))
      .subscribe((members) => {
        this.members =
          page === 1
            ? members.data
            : [...(this.members ?? []), ...members.data];
        this.maxMembers = members.meta.total;
      });
  }
}
