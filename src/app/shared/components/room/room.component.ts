import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from 'src/app/services/search.service';
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

