import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../../../services/routes.service';
import { RouteInterface } from '../../../../interfaces/route.interface';
import { ActivatedRoute } from '@angular/router';
import { openToast } from '../../../../utils/toast.utils';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
  routes?: RouteInterface[];
  selectedRoute?: FormGroup;
  projectId?: number;

  constructor(
    private routesService: RoutesService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
      this.#getRoutes();
    });
  }

  selectRoute(route: RouteInterface) {
    this.selectedRoute = new FormGroup({
      id: new FormControl(route.id),
      name: new FormControl(route.name),
      method: new FormControl(route.method),
      endpoint: new FormControl(route.endpoint),
      enabled: new FormControl(route.enabled),
      created_at: new FormControl(route.created_at),
      updated_at: new FormControl(route.updated_at),
    });
  }

  updateRoute() {
    if (!this.selectedRoute || this.selectedRoute.invalid) return;
    this.routesService
      .editRoute(this.selectedRoute.value.id, this.selectedRoute.value)
      .subscribe({
        next: (newRoute) => {
          this.selectedRoute?.setValue(newRoute);
          openToast(
            this.translateService.instant('PAGES.ROUTES.UPDATED_SUCCESSFULLY', {
              route: newRoute.name,
            }),
            'success'
          );
          this.#getRoutes();
        },
        error: () => {
          const oldRoute = this.routes?.find(
            (route) => route.id === this.selectedRoute?.value.id
          );
          if (oldRoute) this.selectedRoute?.setValue(oldRoute);
        },
      });
  }

  #getRoutes() {
    if (this.projectId === undefined) return;
    this.routesService.getRoutes(this.projectId).subscribe((routes) => {
      this.routes = routes.data;
    });
  }
}
