import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, input, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AlertErrorInputComponent } from '@shared/widgets/alert-error-input/alert-error-input.component';
import { FloatLabelModule } from "primeng/floatlabel";

@Component({
  selector: 'input-text',
  styleUrls: ['./input-text.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AlertErrorInputComponent,
    FloatLabelModule,
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  template: `

    <label class="block text-[#657687] mb-1 text-base" [for]="label()"
    >{{label()}}</label>
    <div class="relative">
      @if (prefix()) {
        <span class="absolute left-3 top-1/2 pb-0.5 -translate-y-1/2 text-gray-500">{{ prefix() }}</span>
      }
      <input [autocomplete]="false" [ngModel]="value" (ngModelChange)="onValueChange($event)"
        [type]="type == 'password' && !showPassword ? 'password' : (type == 'password' ? 'text' : type)"
        class="w-full py-2 px-3 rounded-lg focus:outline-none! focus:ring-0 border border-primary!"
        [ngClass]="{ 'pl-6': prefix(), 'pr-9': type == 'password' }"
        [placeholder]="placeholder()" />
      @if (type == 'password') {
        <i
          class="pi absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
          [ngClass]="showPassword ? 'pi-eye' : 'pi-eye-slash'"
          (click)="showPassword = !showPassword"
        ></i>
      }
    </div>

    <alert-error [control]="control" [label]="label()"></alert-error>
          `
})
export class InputTextComponent implements ControlValueAccessor, OnInit {

  showPassword = false;
  @Input() control!: FormControl | any;
  @Input() idLabel = "";
  @Input() variant: "floating" | "normal" = "normal";
  @Input() name = "";
  @Input() typeLabel: "over" | "on" | "in" = "in";
  @Input() type: "password" | "email" | "text" | "number" = "text";

  placeholder = input(); //default
  prefix = input(''); //default
  label = input("label"); //default
  form: any = input();

  @Output() valueChange = new EventEmitter<any>();

  value: any;

  constructor() { }

  ngOnInit() {
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  hasError(error: string): boolean | null {
    // console.log(this.control.errors);
    return (
      this.control?.hasError(error) &&
      (this.control?.touched || this.control?.dirty)
    );
  }

  onValueChange(value: any) {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Fungsi yang akan dipanggil ketika nilai diubah
  onChange: (date: any) => void = () => { };
  onTouched: () => void = () => { };

}
