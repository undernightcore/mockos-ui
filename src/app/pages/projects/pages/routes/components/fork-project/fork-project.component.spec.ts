import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkProjectComponent } from './fork-project.component';

describe('ForkProjectComponent', () => {
  let component: ForkProjectComponent;
  let fixture: ComponentFixture<ForkProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForkProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForkProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
