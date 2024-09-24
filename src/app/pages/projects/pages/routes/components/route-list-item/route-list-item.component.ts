import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouteInterface } from '../../../../../../interfaces/route.interface';
import { FormControl } from '@angular/forms';
import { RoutesService } from 'src/app/services/routes/routes.service';

@Component({
  selector: 'app-route-list-item',
  templateUrl: './route-list-item.component.html',
  styleUrls: ['./route-list-item.component.scss'],
})
export class RouteListItemComponent {
  @Input() route?: RouteInterface;
  @Input() rounded = true;
  @Input() isSelected = false;
  @Input() sortingMode = false;
  @Input() disablePlaceholder = false;

  checkedForm = new FormControl();
  @Input() set checked(value: boolean) {
    this.checkedForm.setValue(value, { emitEvent: false });
  };
  @Output() checkedChanges = new EventEmitter<boolean>();

  constructor() {
    this.checkedForm.valueChanges.subscribe((value) => this.checkedChanges.emit(Boolean(value)))
  }
}
