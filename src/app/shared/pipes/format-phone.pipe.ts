import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatPhone' })
export class FormatPhonePipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    let digits = String(value).replace(/\D/g, '');
    if (!digits.startsWith('0')) digits = '0' + digits;

    return [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12)]
      .filter(Boolean)
      .join('-');
  }
}
