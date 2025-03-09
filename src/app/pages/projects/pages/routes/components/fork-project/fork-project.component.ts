import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fork-project',
  templateUrl: './fork-project.component.html',
  styleUrls: ['./fork-project.component.scss'],
})
export class ForkProjectComponent {
  forkForm = new FormControl(this.name || '', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<ForkProjectComponent>,
    @Inject(MAT_DIALOG_DATA) private name?: string
  ) {}
}
