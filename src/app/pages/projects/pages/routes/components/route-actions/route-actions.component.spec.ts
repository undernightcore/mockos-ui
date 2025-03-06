import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteActionsComponent } from './route-actions.component';

describe('RouteActionsComponent', () => {
  let component: RouteActionsComponent;
  let fixture: ComponentFixture<RouteActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
