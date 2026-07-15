import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, finalize, from, switchMap } from 'rxjs';

import { StorageMap } from '@ngx-pwa/local-storage';
import { environment } from 'src/environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  // Assume you have access to StorageMap and environment
  // You may need to inject StorageMap via a provider in your app module
  const storage = inject(StorageMap);

  return from(storage.get(environment.tokenName)).pipe(
    switchMap((token: any) => {
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token.token}`,
            'x-api-key': 'reqres-free-v1' // hapus
          },
        });
      }

      return next(request).pipe(
        finalize(() => {
          // end loading
        })
      );
    })
  );
};
