import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputTextComponent } from '@shared/ui/input-text/input-text.component';
import { emailPatternValidator, phonePatternValidator } from '@shared/utils/validator_pattern';

@Component({
  selector: 'app-popup-add-contact',
  templateUrl: './popup-add-contact.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputTextComponent],
})
export class PopupAddContactComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
  ) {
    this.form = this.fb.group({
      nama: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, emailPatternValidator()]],
      phone: ['', [Validators.required, phonePatternValidator()]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.value);
  }

  onCancel(): void {
    this.ref.close();
  }
}
