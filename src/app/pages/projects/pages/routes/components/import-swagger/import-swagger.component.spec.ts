import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportSwaggerComponent } from './import-swagger.component';


describe('ImportSwaggerComponent', () => {
  let component: ImportSwaggerComponent;
  let fixture: ComponentFixture<ImportSwaggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSwaggerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportSwaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
