import { ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Entity_User } from '@core/models/entities/user.entity';
import { logger } from '@shared/utils/logger';
import { LoadingComponent } from '@shared/ui/loading/loading.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.html',
  // styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'OLD PROJECT';

  user = Entity_User.state();

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      const user = this.user.value;
      logger.log('User state changed:', user);
    })

  }


  ngOnInit(): void {




    //MARK:TEST
    setTimeout(() => {
      this.ubah();
      logger.log('Title changed to:', this.title);
      this.cdr.detectChanges();

      // Harap selalu tambahkan this.cdr.detectChanges(); untuk memuat data dari sisi UI secara dinamis, karna project ini menggunakan zoneless;
      // Terkecuali operasi dari angular context seperti event click, dll...
    }, 3000);

    // this.cdr.detectChanges();
    // Initialization logic here
  }

  ubah() {
    this.title = 'CHANGE TO NEW PROJECT';
  }
}
