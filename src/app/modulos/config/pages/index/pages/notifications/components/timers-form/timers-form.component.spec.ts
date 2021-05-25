import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimersFormComponent } from './timers-form.component';

describe('TimersFormComponent', () => {
  let component: TimersFormComponent;
  let fixture: ComponentFixture<TimersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
