import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'error',
  pure: false,
})
export class ErrorPipe implements PipeTransform {
  transform(errors: { [p: string]: any }) {
    return `ERRORS.${Object.keys(errors)[0].toUpperCase()}`;
  }
}
