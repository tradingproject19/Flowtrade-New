import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtDiverganceComponent } from './ft-divergance.component';

describe('FtDiverganceComponent', () => {
  let component: FtDiverganceComponent;
  let fixture: ComponentFixture<FtDiverganceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FtDiverganceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtDiverganceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
