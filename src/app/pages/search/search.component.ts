import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import * as moment from 'moment';
import { HotelDetails } from 'src/app/shared/models/hotel-details.model';
import { DateRange } from '@angular/material/datepicker';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DropdownType } from 'src/app/shared/models/dropdown-type';
import { DealsService } from 'src/app/services/deals.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  dropdownType = DropdownType;
  showDropdown!: DropdownType;
  showFieldWarnings!: DropdownType;

  searchId!: any;
  activateRouteSubscription$!: Subscription;

  searchForm!: FormGroup;
  agesArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  hotelsList: HotelDetails[] = [];
  filteredHotelsList!: Observable<HotelDetails[]>;
  isHotelListLoaded!: boolean;

  locationList: any = [];
  filteredLocationList!: Observable<any>;

  searchResponse: any;
  searchTypeControlSubscription!: Subscription;
  isCurrentCalendarInputCheckout!: boolean;

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dealsService: DealsService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.getsearchForm();

    this.filteredHotelsList = this.searchForm.controls.hotel.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterHotel(value))
    );

    this.filteredLocationList =
      this.searchForm.controls.location.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterLocation(value))
      );

    this.searchTypeControlSubscription =
      this.searchForm.controls.searchType.valueChanges.subscribe((value) => {
        if (value === 'hotel') {
          this.searchForm.controls.hotel.setValidators([Validators.required]);
          this.searchForm.controls.location.setValidators(null);
        }
        if (value === 'location') {
          this.searchForm.controls.hotel.setValidators(null);
          this.searchForm.controls.location.setValidators([
            Validators.required,
          ]);
        }
      });


    this.activateRouteSubscription$ = this.activatedRoute.queryParams.pipe(
      debounceTime(300)
    ).subscribe(
      async (queryParams) => {
        this.searchForm.controls.checkIn.setValue(queryParams['checkIn']);
        this.searchForm.controls.checkOut.setValue(queryParams['checkOut']);
        this.searchForm.controls.cityId.setValue(queryParams['cityId'] || '');
        this.searchForm.controls.stateId.setValue(queryParams['stateId']);
        this.searchForm.controls.countryId.setValue(queryParams['countryId']);
        this.searchForm.controls.searchType.setValue(
          queryParams['searchType'] || 'hotel'
        );
        await this.setHotelName(parseInt(queryParams['productId']));
        this.setLocation(queryParams['cityId'], queryParams['stateId']);
        this.setPaxInfo(queryParams['paxInfo']);
        this.fetchSearchResult();
      }
    );
  }

  ngOnDestroy(): void {
    this.searchTypeControlSubscription.unsubscribe();
  }

  getsearchForm() {
    return this.formBuilder.group({
      searchType: ['hotel'],
      hotel: [''],
      location: [''],
      cityId: [''],
      stateId: [''],
      countryId: [''],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      noOfAdults: [1],
      agesOfChildren: this.formBuilder.array([]),
    });
  }

  filterHotel(value: any): any[] {
    if (!value) value = '';
    let filterValue = value?.toLowerCase();
    let filteredArray = this.hotelsList.filter((val) =>
      val.hotel_name?.toLowerCase().includes(filterValue)
    );
    this.showDropdown =
      filteredArray.length > 0 ? DropdownType.hotel : DropdownType.none;
    return filteredArray;
  }

  filterLocation(value: any): any[] {
    if (!value) value = '';
    let filterValue = value?.toLowerCase();
    let filteredArray = this.locationList.filter((val: any) =>
      val.key?.toLowerCase().includes(filterValue)
    );
    this.showDropdown =
      filteredArray.length > 0 ? DropdownType.location : DropdownType.none;
    return filteredArray;
  }

  async getAllHotels() {
    await this.searchService
      .getAllHotels()
      .toPromise()
      .then((res) => {
        this.hotelsList = res['Hotel_Details'];
        this.getLocationList(res['Hotel_Details']);
        this.isHotelListLoaded = true;
      })
      .catch((err) => console.log(err));
  }

  getLocationList(val: any) {
    val.forEach((e1: any) => {
      //Push city if available
      if (e1.address.city) {
        let obj1 = {
          key: e1.address.city,
          type: 'city',
          cityId: e1.address.cityId,
          state: e1.address.state,
          stateId: e1.address.stateId,
          country: e1.address.country,
          countryId: e1.address.countryId,
        };
        let isFound = false;
        for (let index = 0; index < this.locationList.length; index++) {
          if (this.locationList[index].key === e1.address.city) {
            isFound = true;
            break;
          }
        }
        if (!isFound) this.locationList.push(obj1);
      }

      //Push state
      let obj2 = {
        key: e1.address.state,
        type: 'state',
        stateId: e1.address.stateId,
        country: e1.address.country,
        countryId: e1.address.countryId,
      };
      let isFound = false;
      for (let index = 0; index < this.locationList.length; index++) {
        if (this.locationList[index].key === e1.address.state) {
          isFound = true;
          break;
        }
      }
      if (!isFound) this.locationList.push(obj2);
    });
  }

  toggleDropdown(type: DropdownType) {
    this.showDropdown = this.showDropdown != type ? type : DropdownType.none;
    this.showFieldWarnings = this.dropdownType.none;
    if (type === DropdownType.checkin || type === DropdownType.checkout) {
      this.updateHeaderText();
    }
  }

  changeSearchType(val: string) {
    this.searchForm.controls.searchType.setValue(val);
  }

  async onHotelFieldEvent(type: string, event?: any) {
    if (!this.isHotelListLoaded) {
      await this.getAllHotels();
    }
    if (type === 'focus') {
      this.filterHotel(this.searchForm.controls.hotel.value);
    } else if (type === 'keydown') {
      this.filterHotel(this.searchForm.controls.hotel.value);
    }
  }

  onLocationFieldEvent(type: string, event?: any) {
    if (type === 'focus') {
      this.filterLocation(this.searchForm.controls.location.value);
    } else if (type === 'keydown') {
      this.filterLocation(this.searchForm.controls.location.value);
    }
  }

  focusDestinationFieldInput() {
    if (this.searchForm.controls.searchType.value === 'hotel') {
      document.getElementById('hotel-field-input')?.focus();
    } else {
      document.getElementById('location-field-input')?.focus();
    }
    this.showFieldWarnings = this.dropdownType.none;
  }

  selectHotel(name: string) {
    this.searchForm.controls.hotel.setValue(name);
    setTimeout(() => {
      document.getElementById('hotel-field-input')?.blur();
      this.showDropdown = DropdownType.none;
      this.showFieldWarnings = this.dropdownType.none;
    }, 0);
  }

    selectLocation(option: any) {
      // this.searchForm.controls.status = 'VALID';
      console.log(option,"@@@@@")
    if ((option.type = 'city')) {
      this.searchForm.controls.cityId.setValue(option.cityId);
    }
    this.searchForm.controls.stateId.setValue(option.stateId);
    this.searchForm.controls.countryId.setValue(option.countryId);
    this.searchForm.controls.location.setValue(option.key);
    setTimeout(() => {
      document.getElementById('hotel-field-input')?.blur();
      this.showDropdown = DropdownType.none;
      this.showFieldWarnings = this.dropdownType.none;
    }, 0);
  }

  async setHotelName(id: number) {
    if (!this.isHotelListLoaded) {
      await this.getAllHotels();
    }
    let hotelName = '';
    for (let i = 0; i < this.hotelsList.length; i++) {
      if (this.hotelsList[i].hotel_id === id) {
        hotelName = this.hotelsList[i].hotel_name;
        break;
      }
    }
    this.searchForm.controls.hotel.setValue(hotelName);
  }

  setLocation(cityId: any, stateId: any) {
    let location = '';
    for (let index = 0; index < this.locationList.length; index++) {
      if (cityId) {
        if (this.locationList[index].cityId === cityId) {
          location = this.locationList[index]['key'];
        }
      } else {
        if (this.locationList[index].stateId === stateId) {
          location = this.locationList[index]['key'];
        }
      }
      this.searchForm.controls.location.setValue(location);
    }
  }

  //Ages Methods
  get agesOfChildren() {
    return this.searchForm.get('agesOfChildren') as FormArray;
  }

  getChildrensAgeForm() {
    return this.formBuilder.group({
      age: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.min(1),
          Validators.max(12),
        ],
      ],
    });
  }

  updateChildrensAgeForm(type: string) {
    if (type === 'add') {
      this.agesOfChildren.push(this.getChildrensAgeForm());
    } else if (type === 'remove') {
      this.agesOfChildren.removeAt(this.agesOfChildren.length - 1);
    }
  }

  updateAdultCount(type: string) {
    if (type === 'decrement') {
      let current = this.searchForm.controls.noOfAdults.value;
      if (current > 1) {
        this.searchForm.controls.noOfAdults.setValue(current - 1);
      }
    } else if (type === 'increment') {
      let current = this.searchForm.controls.noOfAdults.value;
      this.searchForm.controls.noOfAdults.setValue(current + 1);
    }
  }

  updateChildCount(type: string) {
    if (type === 'decrement') {
      let current = this.agesOfChildren?.controls?.length;
      if (current > 0) {
        this.updateChildrensAgeForm('remove');
      }
    } else if (type === 'increment') {
      this.updateChildrensAgeForm('add');
    }
  }

  
  
  onSubmit() {
    console.log(this.searchForm, this.searchForm.valid)
    this.searchForm.markAllAsTouched();
    this.showDropdown = this.dropdownType.none;
    // if(      this.searchForm.controls.searchType.status== "VALID" ){
    //   this.searchForm.valid
    // }
    if (this.searchForm.controls.searchType.status== "VALID") {
      let prevUrl = this.router.url.toString();
      let searchParams: any = this.getSearchParams();
      searchParams['searchType'] = this.searchForm.controls.searchType.value;
      this.router
        .navigate(['/search'], { queryParams: searchParams })
        .then((res) => {
          if (prevUrl === this.router.url.toString()) this.scrollToSearchView();
        });
    } else {
      if (
        this.searchForm.controls.hotel.invalid &&
        (this.searchForm.controls.hotel.dirty ||
          this.searchForm.controls.hotel.touched)
      ) {
        this.showFieldWarnings = this.dropdownType.hotel;
      } else if (
        this.searchForm.controls.checkIn.invalid &&
        (this.searchForm.controls.checkIn.dirty ||
          this.searchForm.controls.checkIn.touched)
      ) {
        this.showFieldWarnings = this.dropdownType.checkin;
      } else if (
        this.searchForm.controls.checkOut.invalid &&
        (this.searchForm.controls.checkOut.dirty ||
          this.searchForm.controls.checkOut.touched)
      ) {
        this.showFieldWarnings = this.dropdownType.checkout;
      }
    }
  }

  fetchSearchResult() {
    if (this.searchForm.valid) {
      this.spinner.show();
      let searchParams: any = this.getSearchParams();
      this.searchService.searchRooms(searchParams).subscribe((res) => {
        this.searchResponse = res;

        this.searchId = this.searchResponse['search_id'];
        this.scrollToSearchView();
        this.spinner.hide();

        console.log(this.searchResponse)
      });
    }
  }

 
  scrollToSearchView() {
    var element = document.getElementById('searchTitleId');
    var headerOffset = 250;
    var elementPosition = element?.getBoundingClientRect().top;
    if (elementPosition) {
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  getSearchParams() {
    let searchParams: any = {
      bookingEngineId: BOOKING_ENGINE_ID,
    };
    if (this.searchForm.controls.searchType.value === 'hotel') {
      searchParams.productId = this.getProductId();
    } else {
      if (this.searchForm.controls.cityId.value?.length > 0) {
        searchParams.cityId = this.searchForm.controls.cityId.value;
      }
      searchParams.stateId = this.searchForm.controls.stateId.value;
      searchParams.countryId = this.searchForm.controls.countryId.value;
    }
    if (this.searchForm.controls.checkIn.value?.length > 0) {
      searchParams.checkIn = this.searchForm.controls.checkIn.value;
    }
    if (this.searchForm.controls.checkOut.value?.length > 0) {
      searchParams.checkOut = this.searchForm.controls.checkOut.value;
    }
    if (this.getPaxInfo()) {
      searchParams.paxInfo = this.getPaxInfo();
    }
    return searchParams;
  }

  getProductId() {
    let productId;
    for (let i = 0; i < this.hotelsList.length; i++) {
      if (
        this.hotelsList[i].hotel_name === this.searchForm.controls.hotel.value
      ) {
        productId = this.hotelsList[i].hotel_id;
        break;
      }
    }
    return productId;
  }

  getPaxInfo() {
    let paxString =
      this.searchForm.controls.noOfAdults.value +
      '|' +
      this.agesOfChildren?.controls?.length;


    if (this.agesOfChildren?.controls?.length > 0) {
      for (let i = 0; i < this.agesOfChildren?.controls?.length; i++) {
        paxString += '|' + this.agesOfChildren.controls[i].get('age')?.value;
      }
    }

    return paxString;
  }

  setPaxInfo(paxInfo: any) {
    let paxArray = paxInfo ? paxInfo.toString().split('|') : []
    this.agesOfChildren.clear()
    paxArray.forEach((e: any, i: number) => {
      if (i === 0) {
        this.searchForm.controls.noOfAdults.setValue(parseInt(e));
      } else if (i > 1) {
        this.agesOfChildren.push(this.getChildrensAgeForm());
        this.agesOfChildren.controls[i - 2].get('age')?.setValue(parseInt(e));
      }
    });
  }

  clearFormArray = (formArray: FormArray) => {
    formArray = this.formBuilder.array([]);
  }

  @Input() selectedRangeValue: DateRange<Date> | undefined;
  @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();

  now = new Date();
  secondCalStartDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth() + 1,
    1
  );
  calendarOneHeading: string | undefined | null;
  calendarTwoHeading: string | undefined | null;
  dateRangeSelectionType: 'exact' | '+1' | '+2' | '+3' | '+7' = 'exact';

  onChangeMonth(type: string) {
    var className =
      type === 'next'
        ? 'mat-calendar-next-button'
        : 'mat-calendar-previous-button';
    var classes = document.getElementsByClassName(className);
    var e1 = classes[0] as HTMLElement;
    var e2 = classes[1] as HTMLElement;
    e1.click();
    e2.click();
    this.updateHeaderText();
  }

  updateHeaderText() {
    setTimeout(() => {
      var cl = document.getElementsByClassName('mat-calendar-period-button');
      this.calendarOneHeading = cl[0]?.children[0]?.children[0]?.textContent;
      this.calendarTwoHeading = cl[1]?.children[0]?.children[0]?.textContent;
    }, 0);
  }

  selectedChange(m: any) {
    this.isCurrentCalendarInputCheckout = false;
    if (!this.selectedRangeValue?.start || this.selectedRangeValue?.end) {
      if (this.dateRangeSelectionType != 'exact') {
        let incDays = parseInt(this.dateRangeSelectionType);
        this.selectedRangeValue = new DateRange<Date>(
          m,
          this.addDays(m, incDays)
        );
        this.updateDateSelection('checkin', m);
        this.updateDateSelection('checkout', this.addDays(m, incDays));
        this.showDropdown = DropdownType.none;
      } else {
        this.selectedRangeValue = new DateRange<Date>(m, null);
        this.updateDateSelection('checkin', m);
        this.isCurrentCalendarInputCheckout = true;
      }
    } else {
      const start = this.selectedRangeValue.start;
      const end = m;
      if (end < start) {
        this.selectedRangeValue = new DateRange<Date>(end, start);
        this.updateDateSelection('checkin', end);
        this.updateDateSelection('checkout', start);
      } else {
        this.selectedRangeValue = new DateRange<Date>(start, end);
        this.updateDateSelection('checkin', start);
        this.updateDateSelection('checkout', end);
      }
      this.showDropdown = DropdownType.none;
    }
    // if (!this.selectedRangeValue?.end) {
    //   this.updateDateSelection('checkin', m);
    // } else {
    // }
    this.selectedRangeValueChange.emit(this.selectedRangeValue);
  }

  updateDateSelection(type: string, event: any) {
    let date = moment(event).format('DD/MM/YYYY');
    if (type === 'checkin') {
      this.searchForm.controls.checkIn.setValue(date);
      this.searchForm.controls.checkOut.setValue(null);
    } else if (type === 'checkout') {
      this.searchForm.controls.checkOut.setValue(date);
    }
  }

  setDateRangeSelectionType(val: 'exact' | '+1' | '+2' | '+3' | '+7') {
    this.dateRangeSelectionType = val;
  }

  addDays(date: string | number | Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
