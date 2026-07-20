import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelperService } from '@core/services/helper.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputTextComponent } from '@shared/ui/input-text/input-text.component';
import { emailPatternValidator, phonePatternValidator } from '@shared/utils/validator_pattern';
import { PopupComponent } from '@shared/ui/popup/popup.component';
import { ContactListComponent } from './contact-list.component';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact-list-page',
  templateUrl: './contact-list-page.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, InputTextComponent, ContactListComponent, PopupComponent],
})
export class ContactListPageComponent {

  form: FormGroup;
  contacts: Contact[] = [];
  showAddForm = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private helper: HelperService,
  ) {
    this.form = this.fb.group({
      nama: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, emailPatternValidator()]],
      phone: ['', [Validators.required, phonePatternValidator()]],
    });
    this.contacts = this.contactService.getContacts();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.contactService.addContact({
      nama: this.form.value.nama,
      email: this.form.value.email,
      phone: Number(this.form.value.phone),
    });
    this.form.reset();
    this.showAddForm = false;
    this.refresh();
  }

  onDelete(id: string): void {
    this.helper.confirmationAlert({
      type: 'delete',
      title: 'Hapus Kontak',
      message: 'Yakin ingin menghapus kontak ini?',
      button: 'Hapus',
    }).then(ok => {
      if (!ok) return;
      this.helper.showLoading('Menghapus kontak...');
      setTimeout(() => {
        this.contactService.deleteContact(id);
        this.refresh();
        this.helper.dismissLoading();
      }, 500);
    });
  }

  onToggleFavorite(id: string): void {
    this.contactService.toggleFavorite(id);
    this.refresh();
  }

  private refresh(): void {
    this.contacts = this.contactService.getContacts();
  }
}
