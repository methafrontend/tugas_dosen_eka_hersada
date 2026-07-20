import { Injectable } from '@angular/core';
import { Contact } from './contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private contacts: Contact[] = [
    { id: crypto.randomUUID(), nama: 'Budi Santoso', email: 'budi@example.com', phone: 81234567890, isFavorite: true, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), nama: 'Siti Aminah', email: 'siti@example.com', phone: 82198765432, isFavorite: false, createdAt: new Date().toISOString() },
  ];

  getContacts(): Contact[] {
    return this.contacts;
  }

  addContact(data: Pick<Contact, 'nama' | 'email' | 'phone'>): void {
    this.contacts.push({
      id: crypto.randomUUID(),
      ...data,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    });
  }

  deleteContact(id: string): void {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }

  toggleFavorite(id: string): void {
    const contact = this.contacts.find(c => c.id === id);
    if (contact) contact.isFavorite = !contact.isFavorite;
  }
}
