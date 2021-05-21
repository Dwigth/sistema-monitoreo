import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsTableComponent } from './ws-table.component';

describe('WsTableComponent', () => {
  let component: WsTableComponent;
  let fixture: ComponentFixture<WsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
