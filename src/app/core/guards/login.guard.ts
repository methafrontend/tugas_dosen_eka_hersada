import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HelperService } from '@core/services/helper.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(StorageMap);
  const helper = inject(HelperService);



  return storage.get(environment.tokenName).pipe(
    map((token: any) => {
      if (token) {


        router.navigateByUrl('/home');
        // helper.showPopup(
        //   'error',
        //   'Maaf',
        //   'Mohon untuk logout akun terlebih dahulu di browser ini!'
        // );
        return false;
      } else {
        return true;
      }
    })
  );
};
