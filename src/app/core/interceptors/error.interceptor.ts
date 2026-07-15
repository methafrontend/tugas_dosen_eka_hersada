import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpInterceptorFn } from '@angular/common/http';
import { logger } from '@shared/utils/logger';

const excludedUrls: string[] = [
  '/your-excluded-url',
  '/another-excluded-url',
  '/api/health',
  // Tambahkan URL lain yang ingin dikecualikan di sini
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      if (excludedUrls.some((url) => req.url.includes(url))) {
        return throwError(() => err);
      }

      // You need to inject services manually since HttpInterceptorFn is a function
      // const helper: HelperService = injector.get(HelperService);
      // const auth: AuthService = injector.get(AuthService);

      switch (err.status) {
        case 401:
          setTimeout(() => {
            // helper.errorAlertHandler(err);
            // helper.dismissLoading();
            // auth.onLogout();
          }, 1000);
          break;
        default:
          setTimeout(() => {
            // helper.dismissLoading();
            // helper.errorAlertHandler(err);
          }, 1000);
          break;
      }

      const fieldError = err?.error?.errors && Object.values(err.error.errors).flat()[0];
      const error = fieldError || err?.error?.message || err?.statusText;

      logger.error('Error Interceptor:', error);
      return throwError(() => error);
    })
  );
};
