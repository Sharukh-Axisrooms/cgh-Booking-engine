import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
@Component({
  selector: 'app-no-booking',
  templateUrl: './no-booking.component.html',
  styleUrls: ['./no-booking.component.css'],
})
export class NoBookingComponent implements OnInit {
  constructor(private router: Router) {}
  @Output() btnEvent = new EventEmitter<any>();

  ngOnInit(): void {}

  goToSearchPage() {
    // this.btnEvent.emit('button clicked');
    this.router.navigate(['/search'])
  }
}
