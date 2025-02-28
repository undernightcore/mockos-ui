import { EventEmitter } from '@angular/core';

export interface ResponseMenuOptionInterface {
  icon: string;
  action: EventEmitter<void>;
  label: string;
}
