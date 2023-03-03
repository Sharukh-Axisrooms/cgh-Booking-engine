import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from 'src/app/services/search.service';
import { BOOKING_ENGINE_ID } from '../../constants/url.constants';
import { ImagePopupComponent } from '../image-popup/image-popup.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  @Input() room: any;
  @Input() id: number | any;
  @Input() property: any;
  @Output() btnEvent = new EventEmitter<any>();

  constructor(
    private searchService: SearchService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.room, this.property)

    // this.getPrices()

  }


  getPrices(){
    let params: any = {};
    params['bookingEngineId'] = BOOKING_ENGINE_ID;
    params['isDorm'] =false;
    params['productId'] =this.property.hotel_id;
    // params['paxInfo'] =this.property.hotel_id;
    // params['checkIn'] =this.property.check_in;
    // params['checkOut'] =this.property.check_out;

    this.searchService.getRoomPrices(params).subscribe(res=>{})

  }

  onBookNow() {
    this.btnEvent.emit('button clicked');
  }

  expandImg(img: any) {
    const dialogRef = this.dialog.open(ImagePopupComponent, {
      data: img,
      width: '600px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

