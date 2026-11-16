import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponseTerminalComponent } from './response-terminal.component';

describe('ResponseTerminalComponent', () => {
  let component: ResponseTerminalComponent;
  let fixture: ComponentFixture<ResponseTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponseTerminalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponseTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
