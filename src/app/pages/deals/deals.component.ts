import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DealsService } from 'src/app/services/deals.service';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css'],
})
export class DealsComponent implements OnInit, OnDestroy {
  deals: any;
  activateRouteSubscription$: Subscription;
  index: number | undefined;

  constructor(
    private dealsService: DealsService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ) {
    this.activateRouteSubscription$ = this.activatedRoute.queryParams
      .pipe(debounceTime(500))
      .subscribe((queryParams) => {
        this.setIndex(queryParams['index']);
      });
  }

  ngOnInit(): void {
    this.getDeals();
  }

  setIndex(val: number) {
    this.index = val;
    const element = document.getElementById(`index-${val}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  getDeals() {
    this.dealsService.getDeals().subscribe((res) => {
      this.deals = res;
    });
  }

  ngOnDestroy(): void {
    this.activateRouteSubscription$.unsubscribe();
  }

  search(id: any){
    let searchParams: any 
    searchParams['productId'] = id;
    // this.dialogRef.close()
    this.router.navigate(['/search'], { queryParams: searchParams })
  }
  }
