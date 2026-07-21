import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';
import { HighlightFavoriteDirective } from '@shared/directives/highlight-favorite.directive';
import { Contact_m } from '../../../core/models/contact/contact.model';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  imports: [UpperCasePipe, DatePipe, NgClass, FormatPhonePipe, HighlightFavoriteDirective, ButtonComponent],
})
export class ContactCardComponent {

  @Input({ required: true }) contact!: Contact_m;
  @Output() delete = new EventEmitter<string>();
  @Output() toggleFavorite = new EventEmitter<string>();

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  onToggleFavorite(id: string): void {
    this.toggleFavorite.emit(id);
  }
}
