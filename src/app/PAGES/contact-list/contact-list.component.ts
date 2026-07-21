import { Component } from '@angular/core';
import { HelperService } from '@core/services/helper.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { PopupAddContactComponent } from '@shared/popups/popup-add-contact.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';
import { ContactCardComponent } from '../../shared/widgets/contact-card/contact-card.component';
import { ContactService } from '../../API/contact/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  imports: [ButtonComponent, ContactCardComponent, DynamicDialogModule],
})
export class ContactListComponent {

  contacts;

  constructor(
    private contactService: ContactService,
    private helper: HelperService,
    private dialogService: DialogService,
  ) {
    this.contacts = this.contactService.contacts;
  }

  async openAddContact(): Promise<void> {
    const ref = this.dialogService.open(PopupAddContactComponent, {
      header: 'Tambah Kontak',
      modal: true,
      dismissableMask: true,
      width: '28rem',
    });
    const result = await firstValueFrom(ref.onClose);
    if (!result) return;
    this.contactService.addContact({
      nama: result.nama,
      email: result.email,
      phone: Number(result.phone),
    });
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
      this.helper.showLoading('Menghapus kontak...');
      setTimeout(() => {
        this.contactService.deleteContact(id);
        this.helper.dismissLoading();
        this.helper.showPopup('success', 'Berhasil', 'Kontak berhasil dihapus', true);
      }, 200);
    });
  }

  onToggleFavorite(id: string) {
    this.contactService.toggleFavorite(id);
  }
}
