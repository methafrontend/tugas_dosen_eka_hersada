import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from '@shared/ui/input-text/input-text.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextComponent
  ],
  exports: [ReactiveFormsModule, FormsModule, InputTextComponent],
})
export class LibraryModule { }
