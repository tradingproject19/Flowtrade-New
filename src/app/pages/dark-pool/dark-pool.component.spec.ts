import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkPoolComponent } from './dark-pool.component';

describe('DarkPoolComponent', () => {
  let component: DarkPoolComponent;
  let fixture: ComponentFixture<DarkPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkPoolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DarkPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
