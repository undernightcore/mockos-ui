import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  SimpleResponseInterface,
  SimpleResponseWithProcessorInterface,
} from '../../../../../../interfaces/response.interface';
import { ResponseMenuOptionInterface } from '../../interfaces/response-menu-option.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-response-list-item',
  templateUrl: './response-list-item.component.html',
  styleUrls: ['./response-list-item.component.scss'],
})
export class ResponseListItemComponent implements OnInit {
  @Input() response?: SimpleResponseWithProcessorInterface;
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
      disabled: true,
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

  ngOnInit() {
    console.log(this.response);
  }

  responseMenuClick(click: MouseEvent, button: ResponseMenuOptionInterface) {
    click.stopPropagation();
    button.action.emit();
  }

  trackByButton(_index: number, button: ResponseMenuOptionInterface) {
    return button.label;
  }
}
