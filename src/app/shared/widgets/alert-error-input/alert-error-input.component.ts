import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'alert-error',
  templateUrl: './alert-error-input.component.html',
  standalone: true,
})
export class AlertErrorInputComponent implements OnInit {
  @Input() control!: FormControl | any;
  @Input() label!: string;
  @Input() secondLabel!: string;
  constructor() { }

  ngOnInit() { }

  hasError(error: string): boolean {
    //console.log(error, this.control.errors);
    return (
      this.control?.hasError(error) &&
      (this.control?.touched || this.control?.dirty)
    );
  }
}
