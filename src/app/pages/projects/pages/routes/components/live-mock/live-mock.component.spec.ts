import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMockComponent } from './live-mock.component';

describe('LiveMockComponent', () => {
  let component: LiveMockComponent;
  let fixture: ComponentFixture<LiveMockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveMockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
