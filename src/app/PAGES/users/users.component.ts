import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UserService } from '@api/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [CommonModule, TableModule]
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  constructor(
    private user: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.user.get_users().then((res) => {
      const data = res?.data;
      this.users = data ? [].concat(data) : [];
      this.cdr.detectChanges();
    });
  }

}
