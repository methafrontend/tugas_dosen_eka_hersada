import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelperService } from '@core/services/helper.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputTextComponent } from '@shared/ui/input-text/input-text.component';
import { emailPatternValidator, phonePatternValidator } from '@shared/utils/validator_pattern';
import { PopupComponent } from '@shared/ui/popup/popup.component';
import { ContactListComponent } from '../contact-list.component';
import { Contact } from '../../../core/models/contact/contact.model';
import { ContactService } from '../../../API/contact/contact.service';

@Component({
  selector: 'app-contact-list-page',
  templateUrl: './list.component.html',
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
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nama: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, emailPatternValidator()]],
      phone: ['', [Validators.required, phonePatternValidator()]],
    });
    this.contacts = this.contactService.getContacts();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  onSubmit() {
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
    this.helper.showPopup('success', 'Berhasil', 'Kontak berhasil ditambahkan', true);
  }

  onDelete(id: string) {
    this.helper.confirmationAlert({
      type: 'delete',
      title: 'Hapus Kontak',
      message: 'Yakin ingin menghapus kontak ini?',
      button: 'Hapus',
    }).then(ok => {
      if (!ok) return;
      setTimeout(() => {
        this.contactService.deleteContact(id);
        this.refresh();
        this.helper.dismissLoading();
        this.cdr.detectChanges();
      }, 200);
    this.helper.showPopup('success', 'Berhasil', 'Kontak berhasil dihapus', true);
    });
  }

  onToggleFavorite(id: string) {
    this.contactService.toggleFavorite(id);
    this.refresh();
  }

  private refresh() {
    this.contacts = this.contactService.getContacts();
  }
}
