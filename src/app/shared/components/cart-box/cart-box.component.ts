import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingService } from 'src/app/services/booking.service';
import { BookingItem } from '../../models/booking.model';

@Component({
  selector: 'app-cart-box',
  templateUrl: './cart-box.component.html',
  styleUrls: ['./cart-box.component.css'],
})
export class CartBoxComponent implements OnInit {
  bookingItem$: Observable<BookingItem | undefined>;

  constructor(private bookingService: BookingService) {
    this.bookingItem$ = this.bookingService.currBookingItem$
  }

  ngOnInit(): void {}
}
