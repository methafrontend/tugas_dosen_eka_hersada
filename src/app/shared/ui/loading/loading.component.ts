import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListenerService } from '@core/services/listener.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  constructor(public listener: ListenerService) {}
}
