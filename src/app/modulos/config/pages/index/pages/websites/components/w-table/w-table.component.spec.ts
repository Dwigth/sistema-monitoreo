import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WTableComponent } from './w-table.component';

describe('WTableComponent', () => {
  let component: WTableComponent;
  let fixture: ComponentFixture<WTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
