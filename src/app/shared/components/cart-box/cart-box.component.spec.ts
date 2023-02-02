import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBoxComponent } from './cart-box.component';

describe('CartBoxComponent', () => {
  let component: CartBoxComponent;
  let fixture: ComponentFixture<CartBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
