import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, take } from 'rxjs';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { FormControl } from '@angular/forms';
import {
  ForkedProjectInterface,
  ProjectInterface,
} from '../../interfaces/project.interface';

@Component({
  selector: 'app-invitation-card',
  templateUrl: './invitation-card.component.html',
  styleUrls: ['./invitation-card.component.scss'],
})
export class InvitationCardComponent {
  @Input() project?: ProjectInterface;

  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
}
