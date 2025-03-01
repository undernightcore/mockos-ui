import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimpleResponseInterface } from '../../../../../../interfaces/response.interface';
import { ResponseMenuOptionInterface } from '../../interfaces/response-menu-option.interface';

@Component({
  selector: 'app-response-list-item',
  templateUrl: './response-list-item.component.html',
  styleUrls: ['./response-list-item.component.scss'],
})
export class ResponseListItemComponent {
  @Input() response?: SimpleResponseInterface;
  @Input() loading = false;

  @Output() processor = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() select = new EventEmitter<void>();
  @Output() config = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() duplicate = new EventEmitter<void>();
  @Output() enableResponse = new EventEmitter<void>();

  buttons: ResponseMenuOptionInterface[] = [
    { icon: 'pencil', action: this.edit, label: 'Editar' },
    { icon: 'header', action: this.duplicate, label: 'Header', disabled: true },
    {
      icon: 'duplicate',
      action: this.delete,
      label: 'Duplicar',
      disabled: true,
    },
    { icon: 'processor', action: this.processor, label: 'Live mock' },
    { icon: 'bin', action: this.config, label: 'Eliminar', disabled: true },
  ];

  responseMenuClick(click: MouseEvent, button: ResponseMenuOptionInterface) {
    click.stopPropagation();
    button.action.emit();
  }

  trackByButton(_index: number, button: ResponseMenuOptionInterface) {
    return button.label;
  }
}
