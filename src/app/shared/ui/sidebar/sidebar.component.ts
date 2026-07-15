import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@api/auth/auth.service';
import { ButtonComponent } from '@shared/ui/button/button.component';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [RouterLink, RouterLinkActive, ButtonComponent]
})
export class SidebarComponent {

  menu: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Users', icon: 'pi pi-users', route: '/users' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' }
  ];

  constructor(private auth: AuthService) { }

  logout() {
    this.auth.logout();
  }

}
