import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { SimpleResponseInterface } from 'src/app/interfaces/response.interface';
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
    {
      icon: 'pencil',
      action: this.edit,
      label: this.translateService.instant(`COMMON.EDIT`),
    },
    {
      icon: 'header',
      action: this.config,
      label: this.translateService.instant(`COMMON.HEADERS`),
      disabled: true,
    },
    {
      icon: 'duplicate',
      action: this.duplicate,
      label: this.translateService.instant(`COMMON.DUPLICATE`),
    },
    {
      icon: 'processor',
      action: this.processor,
      label: this.translateService.instant(`PAGES.ROUTES.LIVE_MOCK`),
    },
    {
      icon: 'bin',
      action: this.delete,
      label: this.translateService.instant(`COMMON.DELETE`),
    },
  ];

  constructor(private translateService: TranslateService) {}

  responseMenuClick(click: MouseEvent, button: ResponseMenuOptionInterface) {
    click.stopPropagation();
    button.action.emit();
  }

  onComponentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      target.closest('app-checkbox') ||
      target.closest('.response__actions__icons')
    )
      return;

    this.edit.emit();
  }

  trackByButton(_index: number, button: ResponseMenuOptionInterface) {
    return button.label;
  }
}
