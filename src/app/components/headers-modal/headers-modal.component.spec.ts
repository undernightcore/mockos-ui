import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadersModalComponent } from './headers-modal.component';

describe('ConfirmModalComponent', () => {
  let component: HeadersModalComponent;
  let fixture: ComponentFixture<HeadersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadersModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
