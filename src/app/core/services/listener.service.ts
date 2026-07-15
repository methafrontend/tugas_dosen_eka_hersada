import { Injectable, signal } from '@angular/core';

export type ForceLogoutReason =
  | 'SESSION_TAKEN'
  | 'TOKEN_EXPIRED'
  | 'BANNED';

@Injectable({
  providedIn: 'root'
})
export class ListenerService {

  $loading: any = signal<{ load: boolean; message?: any }>({
    load: false,
    message: null,
  });


  forceLogout = signal<{
    reason: ForceLogoutReason;
    payload?: any;
    at: number;
  } | null>(null);

  constructor() { }


  emitForceLogout(reason: ForceLogoutReason, payload?: any) {
    this.forceLogout.set({
      reason,
      payload,
      at: Date.now()
    });
  }

  clear() {
    this.forceLogout.set(null);
  }

}
