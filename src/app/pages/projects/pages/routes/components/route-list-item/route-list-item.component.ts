import { Component, Input } from '@angular/core';
import { RouteInterface } from '../../../../../../interfaces/route.interface';
import { ProjectManagerService } from '../../services/project.manager';
import { CreateRouteInterface } from 'src/app/interfaces/create-route.interface';

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

  constructor(private projectManager: ProjectManagerService) {}

  openEditRouteModal(id: number, data: CreateRouteInterface) {
    this.projectManager.openEditRouteModal(id, false, data).subscribe();
  }

  openDeleteRouteModal(route: RouteInterface) {
    this.projectManager.openDeleteRouteModal(route).subscribe()
  }
}
