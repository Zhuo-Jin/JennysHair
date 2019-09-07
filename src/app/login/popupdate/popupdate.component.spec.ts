import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupdateComponent } from './popupdate.component';

describe('PopupdateComponent', () => {
  let component: PopupdateComponent;
  let fixture: ComponentFixture<PopupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
