import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[appHighlightFavorite]' })
export class HighlightFavoriteDirective {

  @Input('appHighlightFavorite') isFavorite = false;

  @HostBinding('style.background-color')
  get backgroundColor(): string | null {
    return this.isFavorite ? '#FEF08A' : null;
  }
}
