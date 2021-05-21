import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WFormComponent } from './w-form.component';

describe('WFormComponent', () => {
  let component: WFormComponent;
  let fixture: ComponentFixture<WFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
