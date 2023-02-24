import { Component, OnInit } from '@angular/core';
import { async, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingService } from 'src/app/services/booking.service';
import { Reflector } from 'src/app/services/reflector';
import { BookingCart, BookingItem } from '../../models/booking.model';

@Component({
  selector: 'app-cart-box',
  templateUrl: './cart-box.component.html',
  styleUrls: ['./cart-box.component.css'],
})
export class CartBoxComponent implements OnInit {
  bookingCart$: Observable<BookingCart | undefined>;
  bookingItems: BookingItem[] | undefined = []
  currency: any;
  constructor(private bookingService: BookingService,
    private bookingCartReflect: Reflector<BookingCart>,
  ) {
    this.bookingCart$ = this.bookingService.bookingCart$
    this.bookingCart$.subscribe(res => {
      this.bookingItems = res?.bookingItems
      this.currency = res?.bookingItems[0]?.renderData?.currency
    })
  }

  ngOnInit(): void {
    console.log("===========================================")
    console.log(this.bookingCart$, this.bookingItems)
  }

  getTotal(item: BookingItem[] | undefined = []) {
    const grandTotal = item.reduce((total, item) => {
      let addonTotal = item.addonTotalPrice ? item.addonTotalPrice : 0
      return item.totalAmount + addonTotal + total
    }, 0)
    console.log(grandTotal, "#####")
    return grandTotal;
  }

  remove(i: number) {
    this.bookingService.removeCurrentBookingItemFromList(i)

    console.log(this.bookingItems, this.bookingService)
  }
}
