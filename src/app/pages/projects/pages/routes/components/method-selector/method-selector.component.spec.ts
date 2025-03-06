import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodSelectorComponent } from './method-selector.component';

describe('MethodSelectorComponent', () => {
  let component: MethodSelectorComponent;
  let fixture: ComponentFixture<MethodSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MethodSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
