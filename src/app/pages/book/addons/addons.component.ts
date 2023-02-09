import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.css'],
})
export class AddonsComponent implements OnInit {
  addons: any = [];
  selectedAddons: any;
  openAddon: boolean | undefined
  num = 0
  totalPrice: number | undefined;
  indexOdAddon: any;
  addonDetail: any;
  config = {
    id: 'custom',
    itemsPerPage: 4,
    currentPage: 1,
  };

  constructor(
    private bookingService: BookingService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.openAddon = false
    this.getAddons()
  }

  add(e: string) {

    if (e == "add") {
      this.num += 1
    } else if (e == "minus") {
      this.num -= 1
      if (this.num <= 0) {
        this.num = 0;
      }
    }

  }

  calAmt(e: string, price: number, i: any) {

    if (e == "add") {
      this.num += 1
    } else if (e == "minus") {
      this.num -= 1
      if (this.num <= 0) {
        this.num = 0;
      }
    }
    this.indexOdAddon = i
    this.totalPrice = price
    this.totalPrice = price * this.num

  }

  getAddons() {

    this.spinner.show();
    if (this.bookingService.currBookingItemValue) {
      this.bookingService
        .getAddons({
          hotelId: this.bookingService.currBookingItemValue['hotelId'],
          searchId: this.bookingService.currBookingItemValue['searchId'],
        })
        .subscribe((res) => {
          this.addons = res['policies'];
          this.addons.forEach((element: { count: number; }) => {
            element.count = 0;
          });
          console.log(this.addons)
          this.spinner.hide();
        });
    }
  }

  addAddon(addon: any) {
    this.bookingService.addAddon(addon);
  }

  removeAddon(addon: any) {
    this.bookingService.removeAddon(addon);
  }

  getQty(id: any) {
    let qty = 0;
    for (let index = 0; index < this.selectedAddons.length; index++) {
      if (id === this.selectedAddons[index]['policy_id']) {
        qty = this.selectedAddons[index]['qty'];
        break;
      }
    }
    return qty;
  }


  getDetails(e: any) {
    this.addonDetail = e;
  }
}
