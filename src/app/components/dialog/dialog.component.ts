import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input() title = '';
  @Input() overflowContent: 'scroll' | 'auto' | 'hidden' | 'visible' =
    'visible';
  @Input() closable = false;
  @Output() closeTriggered = new EventEmitter();
}
