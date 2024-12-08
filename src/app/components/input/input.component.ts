import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() control = new FormControl<string | number>('');
  @Input() icon? = '';
  @Input() backgroundColor = '#1D1B20';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
  

  protected readonly Validators = Validators;
}
