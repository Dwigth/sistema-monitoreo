import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsFormComponent } from './ws-form.component';

describe('WsFormComponent', () => {
  let component: WsFormComponent;
  let fixture: ComponentFixture<WsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
