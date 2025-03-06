import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectInterface } from '../../interfaces/project.interface';

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
