import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchElementComponent } from './launch-element.component';

describe('LaunchElementComponent', () => {
  let component: LaunchElementComponent;
  let fixture: ComponentFixture<LaunchElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
