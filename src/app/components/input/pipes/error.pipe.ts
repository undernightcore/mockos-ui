import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'error',
  pure: false,
})
export class ErrorPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(errors: { [p: string]: any }) {
    const [type, value] = Object.entries(errors)[0];
    return this.translateService.instant(`ERRORS.${type.toUpperCase()}`, {
      value,
    });
  }
}
