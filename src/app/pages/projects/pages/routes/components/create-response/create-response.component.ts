import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponsesService } from '../../../../../../services/responses/responses.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ResponseModalDataInterface } from './interfaces/response-modal-data.interface';
import { CreateResponseInterface } from '../../../../../../interfaces/create-response.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { openToast } from '../../../../../../utils/toast.utils';
import { finalize, iif, Subscription } from 'rxjs';
import { RealtimeService } from '../../../../../../services/realtime/realtime.service';
import { TranslateService } from '@ngx-translate/core';
import { CompareResponsesComponent } from '../compare-responses/compare-responses.component';
import { CreateResponseWithFileModel } from '../../../../../../models/create-response-with-file.model';
import { CreateResponseModel } from '../../../../../../models/create-response.model';
import {
  isValidJson,
  prettifyJson,
} from '../../../../../../utils/string.utils';
import { EditorTypeEnum } from '../../../../../../interfaces/response-type.interface';

@Component({
  selector: 'app-create-response',
  templateUrl: './create-response.component.html',
  styleUrls: ['./create-response.component.scss'],
})
export class CreateResponseComponent implements AfterViewInit, OnDestroy {
  responseSubscription?: Subscription;
  newChanges = false;

  selectedFile = this.data.selectedFile;

  saving = false;
  mode = EditorTypeEnum.JSON;

  responseForm = new FormGroup({
    name: new FormControl(
      this.data.responseData?.name ??
        this.translateService.instant('COMMON.DEFAULT'),
      [Validators.required]
    ),
    status: new FormControl(this.data.responseData?.status ?? 200, [
      Validators.required,
      Validators.min(100),
      Validators.max(599),
    ]),
    body: new FormControl(
      this.fileInBack ? '{}' : this.data.responseData?.body ?? '{}',
      [Validators.required]
    ),
    enabled: new FormControl(this.data.responseData?.enabled ?? true),
  });

  get isEditing() {
    return Boolean(this.data.responseData);
  }

  get fileInBack() {
    return this.data.responseData?.is_file
      ? this.data.responseData?.body
      : undefined;
  }

  get fileMode() {
    return Boolean(this.selectedFile || this.fileInBack);
  }

  get warningInvalidJson() {
    return (
      this.mode === EditorTypeEnum.JSON &&
      !isValidJson(this.responseForm.controls.body.value || '{}')
    );
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResponseModalDataInterface,
    public dialogRef: DialogRef,
    private responsesService: ResponsesService,
    private realtimeService: RealtimeService,
    private translateService: TranslateService,
    private dialogService: MatDialog
  ) {}

  ngAfterViewInit() {
    this.#listenToChanges();
  }

  ngOnDestroy() {
    this.responseSubscription?.unsubscribe();
  }

  handleSave() {
    if (this.responseForm.invalid && !this.fileMode) return;
    const body = this.#prepareSaveBody();
    this.saving = true;
    iif(
      () => Boolean(this.data.responseData),
      this.responsesService.editResponse(
        this.data.responseData?.id as number,
        body,
        this.fileMode
      ),
      this.responsesService.createResponse(
        this.data.routeId,
        body,
        this.fileMode
      )
    )
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (response) => {
          openToast(response.message, 'success');
          this.dialogRef.close();
        },
        error: (error) => {
          if (error.error.errors[0]) {
            openToast(error.error.errors[0], 'error');
          }
          if (error.status !== 404) return;
          this.#changeToCreateUnexpectedly();
        },
      });
  }

  compareChanges() {
    if (!this.data.responseData) return;
    this.dialogRef.close();
    this.data.responseData.mergeResponses({
      is_file: this.fileMode,
      body: this.fileMode
        ? this.selectedFile?.name ?? this.fileInBack
        : this.responseForm.value.body ?? undefined,
    });
    this.dialogService.open(CompareResponsesComponent, {
      closeOnNavigation: true,
      height: '90%',
      width: '70%',
      data: {
        routeId: this.data.routeId,
        responseData: this.data.responseData,
        selectedFile: this.selectedFile,
      },
      autoFocus: false,
      panelClass: 'mobile-fullscreen',
    });
  }

  clearFileMode() {
    this.selectedFile = undefined;
    this.data.selectedFile = undefined;

    if (this.data.responseData) {
      this.data.responseData.is_file = false;
      this.data.responseData.body =
        this.responseForm.controls.body.value ?? '{}';
    }
  }

  prettifyJson() {
    this.responseForm.controls.body.setValue(
      prettifyJson(this.responseForm.value.body as string)
    );
  }

  #listenToChanges() {
    if (!this.data.responseData) return;
    this.responseSubscription = this.realtimeService
      .listenResponse(this.data.responseData.id)
      .subscribe((event) => {
        if (event === 'deleted') {
          this.#changeToCreateUnexpectedly();
        } else if (event === 'updated') {
          this.newChanges = true;
        }
      });
  }

  #changeToCreateUnexpectedly() {
    this.responseSubscription?.unsubscribe();
    this.data.responseData = undefined;
    openToast(
      this.translateService.instant(
        'PAGES.ROUTES.RESPONSE_UNEXPECTEDLY_DELETED'
      ),
      'warning',
      5000
    );
  }

  #prepareSaveBody() {
    return this.fileMode
      ? new CreateResponseWithFileModel(
          new CreateResponseModel(
            this.responseForm.value as CreateResponseInterface
          ),
          this.selectedFile
        ).formData
      : new CreateResponseModel(
          this.responseForm.value as CreateResponseInterface
        );
  }
}
