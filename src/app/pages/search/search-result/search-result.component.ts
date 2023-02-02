import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  @Input() searchResponse: any = []

  expandTariffBlock:number | undefined;
  imagesArray = tempImagesArray

  constructor() { }

  ngOnInit(): void {
  }

  onTariffsExpandClick(i:number) {
    this.expandTariffBlock === i
    ? this.expandTariffBlock = undefined
    : this.expandTariffBlock = i
  }

}

const tempImagesArray = [
  '../../../../assets/temp/images/20170405144625PMSmallswaswara_web_107_MG_0726.jpg',
  '../../../../assets/temp/images/20170405144824PMSmallcoconut-lagoon-evening-chai-on-a-boat-1.jpg',
  '../../../../assets/temp/images/20170405145238PMSmallKalari-Kovilakom.jpg',
  '../../../../assets/temp/images/20170405145632PMSmallSwaSwara09.jpg',
  '../../../../assets/temp/images/20171019121321PMSmallVisalam.jpg'
]