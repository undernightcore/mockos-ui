import { Component, Input } from '@angular/core';
import { ButtonSizeInterface } from './interfaces/button.interfaces';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() size: ButtonSizeInterface = 'medium';
  @Input() backgroundColor = 'transparent';
  @Input() borderColor = '#cac4d0';
  @Input() color = '#cac4d0';
  @Input() disabled = false;
}
