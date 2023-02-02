import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoBookingComponent } from './no-booking.component';

describe('NoBookingComponent', () => {
  let component: NoBookingComponent;
  let fixture: ComponentFixture<NoBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
