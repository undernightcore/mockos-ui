import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ResponseModalDataInterface } from '../create-response/interfaces/response-modal-data.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { RealtimeService } from '../../../../../../services/realtime/realtime.service';
import { ResponsesService } from '../../../../../../services/responses/responses.service';
import { Subscription } from 'rxjs';
import { CreateResponseComponent } from '../create-response/create-response.component';
import { ResponseModel } from '../../../../../../models/response.model';
import { DiffEditorComponent } from 'src/app/components/monaco/diff-editor.component';

@Component({
  selector: 'app-compare-responses',
  templateUrl: './compare-responses.component.html',
  styleUrls: ['./compare-responses.component.scss'],
})
export class CompareResponsesComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DiffEditorComponent) private editor?: DiffEditorComponent;

  localChanges? = this.data.responseData;
  newLocalChanges? = this.data.responseData?.body;
  localFile? = this.data.selectedFile;

  get localFileName() {
    return (
      this.localFile?.name ??
      (this.data.responseData?.is_file
        ? this.data.responseData.body
        : undefined)
    );
  }

  originChanges?: ResponseModel;

  get originFileName() {
    return this.originChanges?.is_file ? this.originChanges.body : undefined;
  }

  responseSubscription?: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ResponseModalDataInterface,
    private dialogRef: DialogRef,
    private realtimeService: RealtimeService,
    private responsesService: ResponsesService,
    private dialogService: MatDialog
  ) {}

  ngAfterViewInit() {
    this.#getResponse();
  }

  keepLocal() {
    if (!this.originChanges) return;

    if (
      this.localChanges &&
      this.newLocalChanges &&
      !this.localChanges.is_file
    ) {
      this.localChanges.body = this.newLocalChanges;
    }

    this.localChanges?.mergeResponses({
      editorType: this.originChanges.editorType,
      ...(this.localFile ? { body: this.originFileName, is_file: true } : {}),
    });

    this.#returnToResponseModal({
      routeId: this.data.routeId,
      responseData: this.localChanges,
      selectedFile: this.localFile,
    });
  }

  keepOrigin() {
    if (!this.originChanges) return;
    this.#returnToResponseModal({
      routeId: this.data.routeId,
      responseData: this.originChanges,
    });
  }

  #returnToResponseModal(state: ResponseModalDataInterface) {
    this.dialogRef.close();
    this.dialogService.open(CreateResponseComponent, {
      height: '90%',
      width: '70%',
      closeOnNavigation: true,
      data: state,
      panelClass: 'mobile-fullscreen',
      autoFocus: false,
    });
  }

  #getResponse() {
    if (!this.data.responseData) return;
    this.responsesService
      .getResponse(this.data.responseData.id)
      .subscribe((response) => {
        if (this.localChanges && !this.localChanges.is_file) {
          this.localChanges.body = this.newLocalChanges ?? '{}';
        }

        this.originChanges = response;

        if (!this.responseSubscription) this.#listenToChanges();
      });
  }

  #listenToChanges() {
    if (!this.data.responseData) return;
    this.responseSubscription = this.realtimeService
      .listenResponse(this.data.responseData.id)
      .subscribe((event) => {
        if (event === 'deleted') return;
        this.#getResponse();
      });
  }

  ngOnDestroy() {
    this.responseSubscription?.unsubscribe();
  }
}
