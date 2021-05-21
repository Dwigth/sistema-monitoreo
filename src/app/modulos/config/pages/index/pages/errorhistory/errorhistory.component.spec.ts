import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorhistoryComponent } from './errorhistory.component';

describe('ErrorhistoryComponent', () => {
  let component: ErrorhistoryComponent;
  let fixture: ComponentFixture<ErrorhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
