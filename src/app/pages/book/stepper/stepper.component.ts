import { Component, Input, OnInit } from '@angular/core';
import { StepperType } from '../book.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
})
export class StepperComponent implements OnInit {
  eStepper = StepperType;
  @Input() stepper: StepperType = this.eStepper.personalDetails;

  constructor() {}

  ngOnInit(): void {}
}
