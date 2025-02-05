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
  isYaml,
  prettifyJson,
} from '../../../../../../utils/string.utils';
import { EditorTypeEnum } from '../../../../../../interfaces/response-type.interface';

@Component({
  selector: 'app-import-swagger',
  templateUrl: './import-swagger.component.html',
  styleUrls: ['./import-swagger.component.scss'],
})
export class ImportSwaggerComponent implements AfterViewInit, OnDestroy {
  responseSubscription?: Subscription;
  newChanges = false;

  selectedFile = this.data.selectedFile;

  saving = false;
  mode = EditorTypeEnum.YAML;

  responseForm = new FormGroup({
    basePath: new FormControl(),
    body: new FormControl(
      '',
      [Validators.required]
    )
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

  get getEditorMode() {
    return this.mode = isYaml(this.responseForm.controls.body.value || '') ? EditorTypeEnum.YAML : EditorTypeEnum.JSON;
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
    // this.responsesService.createResponse(
    //   this.data.routeId,
    //   body,
    //   this.fileMode
    // )
    //   .pipe(finalize(() => (this.saving = false)))
    //   .subscribe({
    //     next: (response) => {
    //       openToast(response.message, 'success');
    //       this.dialogRef.close();
    //     },
    //     error: (error) => {
    //       if (error.status !== 404) return;
    //       this.#changeToCreateUnexpectedly();
    //     },
    //   });
  }

  clearFileMode() {
    this.selectedFile = undefined;
    this.data.selectedFile = undefined;

    if (this.data.responseData) {
      this.data.responseData.is_file = false;
      this.data.responseData.body =
        this.responseForm.controls.body.value ?? '';
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
    console.log('file',this.fileMode, this.selectedFile)
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

