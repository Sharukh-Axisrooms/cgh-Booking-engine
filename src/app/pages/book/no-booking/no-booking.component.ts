import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-booking',
  templateUrl: './no-booking.component.html',
  styleUrls: ['./no-booking.component.css'],
})
export class NoBookingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToSearchPage() {
    this.router.navigate(['/search']);
  }
}
