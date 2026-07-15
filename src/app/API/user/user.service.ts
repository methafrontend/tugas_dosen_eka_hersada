import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractApiService } from '@core/interceptors/jsonrpc';


@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractApiService<any> {

  constructor(
    http: HttpClient
  ) {
    super(http, '');
  }

  async get_users(params?: any) {
    return this.getAll(params, '/users');
  }


}
