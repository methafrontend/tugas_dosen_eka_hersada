import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactCardComponent } from '../../shared/widgets/contact-card/contact-card.component';
import { Contact } from './contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  imports: [ContactCardComponent],
})
export class ContactListComponent {

  @Input() contacts: Contact[] = [];
  @Output() delete = new EventEmitter<string>();
  @Output() toggleFavorite = new EventEmitter<string>();
}
