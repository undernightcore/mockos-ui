import {
  AfterViewInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CheckboxGroupComponent,
    },
  ],
})
export class CheckboxGroupComponent
  implements ControlValueAccessor, AfterViewInit
{
  @ContentChildren(CheckboxComponent, { descendants: true })
  checkboxes?: QueryList<CheckboxComponent>;

  protected isDisabled = false;
  protected onChange?: (value?: string) => void;
  protected onTouched?: () => void;

  #currentValue = '';

  ngAfterViewInit() {
    setTimeout(() => {
      this.writeValue(this.#currentValue);
    });

    this.checkboxes?.forEach((checkbox) =>
      checkbox.registerOnChange((checked) => {
        if (!checked) {
          checkbox.writeValue(true);
          return;
        }
        this.checkboxes?.forEach((c) =>
          c.writeValue(c.value === checkbox.value)
        );
        this.onChange?.(checkbox.value);
      })
    );
  }

  writeValue(value: string) {
    this.#currentValue = value;
    this.checkboxes?.forEach((checkbox) =>
      checkbox.writeValue(checkbox.value === value)
    );
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  registerOnChange(fn: (value?: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
