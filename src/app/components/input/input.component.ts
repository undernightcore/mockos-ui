import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() control = new FormControl('');
  @Input() backgroundColor = '#1D1B20';
  @Input() label = '';
  @Input() type: 'text' | 'password' = 'text';
  protected readonly Validators = Validators;
}
