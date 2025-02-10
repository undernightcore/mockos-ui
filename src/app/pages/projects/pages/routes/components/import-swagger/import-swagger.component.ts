import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { openToast } from '../../../../../../utils/toast.utils';
import { finalize, Subscription } from 'rxjs';

import { prettifyJson } from '../../../../../../utils/string.utils';
import { ProjectService } from 'src/app/services/project/project.service';
import { ImportSwaggerInterface } from 'src/app/interfaces/import-swagger.interface';

@Component({
  selector: 'app-import-swagger',
  templateUrl: './import-swagger.component.html',
  styleUrls: ['./import-swagger.component.scss'],
})
export class ImportSwaggerComponent implements  OnDestroy {
  responseSubscription?: Subscription;

  newChanges = false;
  isDragging = false;
  saving = false;

  responseForm = new FormGroup({
    basePath: new FormControl('', [
      Validators.pattern('^/([a-zA-Z0-9{}-]+)*(/[a-zA-Z0-9{}-]+)*$')
    ]),
    reset: new FormControl(false),
    swagger: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {projectId: number},
    public dialogRef: DialogRef,
    private projectService: ProjectService
  ) {}

  ngOnDestroy() {
    this.responseSubscription?.unsubscribe();
  }

  handleSave() {
    const projectId = this.data.projectId;
    if (this.responseForm.invalid && projectId) return;

    this.saving = true;

    this.projectService.importSwagger(projectId!, this.responseForm.getRawValue() as ImportSwaggerInterface)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (response) => {
          openToast(response.message, 'success');
          this.dialogRef.close();
        },
        error: (error) => {
          const errorMessage = error.error.errors[0]
          this.#changeToCreateUnexpectedly(errorMessage);
        },
      });
  }

  prettifyJson() {
    this.responseForm.controls.swagger.setValue(
      prettifyJson(this.responseForm.value.swagger as string)
    );
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result || '') as string;
        this.responseForm.controls.swagger.setValue(text);
      };
      reader.readAsText(file);
    }
  }

  #changeToCreateUnexpectedly(error: string) {
    this.responseSubscription?.unsubscribe();

    openToast(error,
      'error',
      5000
    );
  }
}
