import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteInterface } from '../../../../../../interfaces/route.interface';
import { FormControl } from '@angular/forms';
import { RoutesService } from 'src/app/services/routes/routes.service';

@Component({
  selector: 'app-route-list-item',
  templateUrl: './route-list-item.component.html',
  styleUrls: ['./route-list-item.component.scss'],
})
export class RouteListItemComponent implements OnInit {
  @Input() route?: RouteInterface;
  @Input() rounded = true;
  @Input() isSelected = false;
  @Input() sortingMode = false;
  @Input() disablePlaceholder = false;

  @Output() draggingStart = new EventEmitter();
  @Output() draggingEnd = new EventEmitter();

  checkedForm = new FormControl();

  constructor(private routesService: RoutesService) {}

  ngOnInit() {
    this.checkedForm.setValue(Boolean(this.route?.enabled));
    this.checkedForm.valueChanges.subscribe((checked) => {
      if (!this.route) return;
      this.routesService
        .editRoute(this.route?.id, {
          ...this.route,
          enabled: Boolean(checked),
        })
        .subscribe();
    });
  }
}
