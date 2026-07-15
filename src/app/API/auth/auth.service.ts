import { HttpClient } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import { singleStoreFactory } from '@core/config/single-store';
import { AbstractApiService } from '@core/interceptors/jsonrpc';
import { Entity_User } from '@core/models/entities/user.entity';

import { HelperService, Popup_m } from '@core/services/helper.service';
import { ForceLogoutReason, ListenerService } from '@core/services/listener.service';

import { logger } from '@shared/utils/logger';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends AbstractApiService<any> {

  private isLoggingOut = false;

  constructor(
    http: HttpClient,
    private helper: HelperService,
    private listener: ListenerService
  ) {
    super(http, '');


    effect(() => {
      const event = this.listener.forceLogout();

      if (!event || this.isLoggingOut) return;

      this.isLoggingOut = true;
      this.handleForceLogout(event);
    });
  }
  mockUser = {

    key: "ABC123",
    peopleId: 123,
    peopleName: "John Doe",
    peopleUsername: "johndoe",
    nip: "123456789",
    imageProfile: "https://example.com/profile.jpg",
    positionActive: "Manager",
    roleActive: 5,
    positionHistory: {}

  };


  async post_login(
    data: { phone: string; password: string },
    param?: any,
  ) {

    return Entity_User.load(async () => {

      const params = param ? param : {};
      const res = await this.post(data, '/auth/login', params);
      if (res?.access_token) {
        this.setLogin(true);
        this.helper.setStorage(environment.tokenName, {
          token: res.access_token,
          expired: Date.now() + (res.expires_in ?? 0) * 1000,
        });
      }
      logger.log('Logged', res);
      return res;
    });
  }

  initFromApi() {
    this.helper.getStorage(environment.tokenName).then((res) => {
      if (res) {
        this.setLogin(true);
      }
    })
  }

  setLogin(state: boolean) {
    const isLogin = singleStoreFactory<{ isLogin: boolean }>();
    isLogin.set({ isLogin: state });
  }

  async logout() {
    this.helper.showLoading('Logging out...');

    setTimeout(async () => {
      this.helper.removeStorage('users');
      this.helper.removeStorage(environment.tokenName);
      this.helper.removeStorage('isGoogleLogin');


      window.location.href = '/';
    }, 2000);
    // await this.logoutNadia();
  }


  handleForceLogout(event: { reason: ForceLogoutReason; payload?: any; at: number }) {

    console.warn('Force logout:', event.reason);

    const popup: Popup_m = {
      type: 'warning',
      title: 'Logged out',
      message: 'Your account has been logged in from another device. You have been logged out for security reasons.',
      button: 'OK',
      showCancel: false,
    };



    this.helper.confirmationAlert(popup, false).then((ok) => {
      if (!ok) return;
      this.listener.clear();
      this.logout();
    });
  }

}
