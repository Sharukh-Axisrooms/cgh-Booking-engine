import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsBar } from './deals-bar.component';

describe('DealsBar', () => {
  let component: DealsBar;
  let fixture: ComponentFixture<DealsBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealsBar ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
