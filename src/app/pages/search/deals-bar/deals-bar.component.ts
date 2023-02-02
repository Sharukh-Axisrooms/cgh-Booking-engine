import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DealsService } from 'src/app/services/deals.service';

@Component({
  selector: 'app-deals-bar',
  templateUrl: './deals-bar.component.html',
  styleUrls: ['./deals-bar.component.css'],
})
export class DealsBar implements OnInit {
  deals$: Observable<any>;
  imagesArray = imagesArray;

  constructor(private dealsService: DealsService, private router: Router) {
    this.deals$ = this.dealsService.deals$
  }

  ngOnInit(): void {}

  goToDeals(index?: number) {
    if(index != undefined) {
      this.router.navigate(['/deals'],  { queryParams: {index} })
    } else {
      this.router.navigate(['/deals'])
    }
  }
}

const imagesArray = [
  '../../../../assets/temp/images/20170405144824PMSmallcoconut-lagoon-evening-chai-on-a-boat-1.jpg',
  '../../../../assets/temp/images/20170405145238PMSmallKalari-Kovilakom.jpg',
  '../../../../assets/temp/images/20170405145632PMSmallSwaSwara09.jpg',
  '../../../../assets/temp/images/20171019121321PMSmallVisalam.jpg',
  '../../../../assets/temp/images/5_gal_05.jpg',
];
