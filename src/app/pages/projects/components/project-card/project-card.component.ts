import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ForkedProjectInterface } from '../../../../interfaces/project.interface';
import { MatMenuTrigger } from '@angular/material/menu';
import { fromEvent, take } from 'rxjs';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  @Input() project?: ForkedProjectInterface;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() contract = new EventEmitter<void>();

  @ViewChild(CdkMenuTrigger) trigger?: CdkMenuTrigger;
  listenOnScroll() {
    fromEvent(window, 'scroll', { once: true, capture: true })
      .pipe(take(1))
      .subscribe(() => {
        this.trigger?.close();
      });
  }

  openEditModal() {
    this.edit.emit();
  }

  openDeleteModal() {
    this.delete.emit();
  }

  openContractPage(click: MouseEvent) {
    click.stopPropagation();
    this.contract.emit();
  }
}
