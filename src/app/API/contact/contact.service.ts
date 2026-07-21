import { Injectable } from '@angular/core';
import { Contact_m, Entity_Contact } from '../../core/models/contact/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {

  contacts = Entity_Contact.all;

  constructor() {
    if (Entity_Contact.count() === 0) {
      Entity_Contact.setAll([
        { id: crypto.randomUUID(), nama: 'Budi Santoso', email: 'budi@example.com', phone: 81234567890, isFavorite: true, createdAt: new Date().toISOString() },
        { id: crypto.randomUUID(), nama: 'Siti Aminah', email: 'siti@example.com', phone: 82198765432, isFavorite: false, createdAt: new Date().toISOString() },
      ]);
    }
  }

  addContact(data: Pick<Contact_m, 'nama' | 'email' | 'phone'>): void {
    Entity_Contact.add({
      id: crypto.randomUUID(),
      ...data,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    });
  }

  deleteContact(id: string): void {
    Entity_Contact.remove(id);
  }

  toggleFavorite(id: string): void {
    const current = Entity_Contact.getByKey(id)();
    if (current) Entity_Contact.update(id, { isFavorite: !current.isFavorite });
  }
}
