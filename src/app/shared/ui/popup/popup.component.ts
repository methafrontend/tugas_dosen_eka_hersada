import { Component, input, model } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-popup',
  template: `
    <p-dialog [(visible)]="visible" [modal]="true" [header]="header()" [style]="{ width: width() }">
      <ng-content></ng-content>
    </p-dialog>
  `,
  imports: [Dialog],
})
export class PopupComponent {
  visible = model(false);
  header = input('');
  width = input('28rem');
}
