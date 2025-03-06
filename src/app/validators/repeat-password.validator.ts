import { AbstractControl } from '@angular/forms';
import { omitByAndNullify } from '../utils/object.utils';

export function repeatPasswordValidator(control: AbstractControl) {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  if (!password || !repeatPassword) return null;

  if (
    password.value !== repeatPassword.value &&
    password.value &&
    repeatPassword.value
  ) {
    repeatPassword.setErrors({
      ...(repeatPassword.errors ?? {}),
      matching: 'matching',
    });
  } else {
    repeatPassword.setErrors(
      repeatPassword.errors !== null
        ? omitByAndNullify(repeatPassword.errors, 'matching')
        : null
    );
  }

  return null;
}
