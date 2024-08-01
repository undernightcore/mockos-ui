import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CheckboxComponent,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() value = '';

  protected checked = false;
  protected onChange?: (value: boolean) => void;
  protected onTouched?: () => void;
  protected disabled = false;

  writeValue(value: boolean) {
    this.checked = value;
  }

  registerOnChange(fn: (_: boolean) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
