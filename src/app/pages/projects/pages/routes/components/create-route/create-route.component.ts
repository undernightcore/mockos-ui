import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpMethods } from '../../../../../../interfaces/route.interface';
import { CreateRouteInterface } from '../../../../../../interfaces/create-route.interface';
import { CreateFolderInterface } from '../../../../../../interfaces/create-folder.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss'],
})
export class CreateRouteComponent {
  routeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    endpoint: new FormControl(
      { value: '', disabled: Boolean(this.data?.isFolder) },
      Validators.required
    ),
    method: new FormControl<HttpMethods>('get'),
    enabled: new FormControl(true),
  });

  methodOptions: HttpMethods[] = ['get', 'post', 'delete', 'put', 'patch'];

  title = this.translateService.instant(
    this.data?.isFolder
      ? this.data?.data
        ? 'Editar carpeta'
        : 'PAGES.ROUTES.CREATE_NEW_FOLDER'
      : this.data?.data
      ? 'Editar ruta'
      : 'PAGES.ROUTES.CREATE_NEW_ROUTE'
  );

  constructor(
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<CreateRouteComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      isFolder: boolean;
      data: CreateRouteInterface | CreateFolderInterface;
    }
  ) {
    this.routeForm.patchValue(data?.data ?? {});
  }

  handleSubmit() {
    this.routeForm.markAllAsTouched();
    if (!this.routeForm.valid) return;
    
    this.dialogRef.close(this.routeForm.value);
  }
}
