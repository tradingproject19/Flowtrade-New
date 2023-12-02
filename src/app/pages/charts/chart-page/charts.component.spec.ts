import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsPageComponent } from './charts.component';

describe('ChartsComponent', () => {
  let component: ChartsPageComponent;
  let fixture: ComponentFixture<ChartsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartsPageComponent]
    });
    fixture = TestBed.createComponent(ChartsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
