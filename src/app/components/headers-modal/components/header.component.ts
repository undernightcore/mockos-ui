import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HeadersInterface } from '../../../interfaces/headers.interface';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() editing: boolean = false;
  @Input() header?: HeadersInterface;
  @Input() editingForm!: FormGroup<{
    id: FormControl;
    key: FormControl;
    value: FormControl;
  }>;
  @Output() editingHeader = new EventEmitter<void>();
  @Output() deleteHeader = new EventEmitter<void>();
  @Output() cancelEditing = new EventEmitter<void>();
  @Output() saveHeader = new EventEmitter<void>();

  constructor(public dialogRef: MatDialogRef<HeaderComponent>) {}
}
