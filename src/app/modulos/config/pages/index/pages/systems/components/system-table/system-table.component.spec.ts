import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTableComponent } from './system-table.component';

describe('SystemTableComponent', () => {
  let component: SystemTableComponent;
  let fixture: ComponentFixture<SystemTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
