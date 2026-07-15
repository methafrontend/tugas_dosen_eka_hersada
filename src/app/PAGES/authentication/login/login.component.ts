import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '@shared/ui/input-text/input-text.component';
import { HelperService } from '@core/services/helper.service';
import { AuthService } from '@api/auth/auth.service';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextComponent,
    ButtonComponent
  ],
})
export class LoginComponent {
  form: FormGroup;
  private prevPhoneLength = 0;

  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,13}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onPhoneChange(val: string) {
    let numeric = (val || '').replace(/\D/g, '');
    const isDeleting = numeric.length < this.prevPhoneLength;

    const prefix = '62';
    const prefixLen = Math.min(numeric.length, prefix.length);
    const invalidPrefix = numeric.slice(0, prefixLen) !== prefix.slice(0, prefixLen);

    if (invalidPrefix && !isDeleting) {
      this.helper.showPopup('warning', 'Wrong Format', 'Phone number must start with 62 (Indonesia country code).');
      numeric = '';
    }

    this.prevPhoneLength = numeric.length;

    if (numeric !== val) {
      this.form.get('phone')?.setValue(numeric, { emitEvent: false });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawPhone: string = this.form.value.phone;
    if (!/^62/.test(rawPhone)) {
      this.helper.showPopup('warning', 'Wrong Format', 'Phone number must start with 62 (Indonesia country code).');
      return;
    }

    this.helper.showLoading('Loading Data...');
    const payload = { ...this.form.value };
    this.auth.post_login(payload).then((res: any) => {

      if (res?.status === false) {
        this.helper.dismissLoading();
        this.helper.showPopup('error', 'Login Failed', res?.message ?? 'An error occurred, please try again.');
        return;
      }

      setTimeout(() => {
        this.helper.dismissLoading();
        this.helper.routerLink('/dashboard');
      }, 2000);
    }).catch((err) => {
      this.helper.dismissLoading();
      const message = typeof err === 'string' ? err : (err?.message ?? 'An error occurred, please try again.');
      this.helper.showPopup('error', 'Login Failed', message);
    });

  }


}
