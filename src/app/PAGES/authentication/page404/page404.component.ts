import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { HelperService } from '@core/services/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css'],
  imports: [ButtonComponent]
})
export class Page404Component implements OnInit {

  isLoggedIn = false;

  constructor(private router: Router, private helper: HelperService) { }

  ngOnInit() {
    this.helper.getStorage(environment.tokenName).then((token) => {
      this.isLoggedIn = !!token;
    });
  }

  goBack() {
    this.router.navigateByUrl(this.isLoggedIn ? '/admin-panel/dashboard' : '/login');
  }

}
