import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-headers-modal',
  templateUrl: './headers-modal.component.html',
  styleUrls: ['./headers-modal.component.scss'],
})
export class HeadersModalComponent {
  constructor(
    public dialogRef: MatDialogRef<HeadersModalComponent>
  ) {}
}
