import { computed, Injectable, signal } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ListenerService } from './listener.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export interface Popup_m {
  type:
  | 'delete'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'confirm'
  | 'suspend'
  | 'change'
  | 'send'
  | 'restore';
  icon?: string;
  title: string;
  message: string;
  button: string;
  button_cancel?: string;
  showCancel?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private width = signal(window.innerWidth);
  screenWidth = this.width.asReadonly();

  constructor(
    private storage: StorageMap,
    private listener: ListenerService,
    private router: Router
  ) {
    window.addEventListener('resize', () => {
      this.width.set(window.innerWidth);
    });
  }

  screenSize = computed<'mobile' | 'tablet' | 'desktop'>(() => {
    const w = this.width();
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  });


  getTimeInZone(timeZone: any) {
    const options: any = {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    const dateParts: any = {};
    parts.forEach((part) => {
      if (part.type !== 'literal') {
        dateParts[part.type] = part.value;
      }
    });

    return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
  }

  //Fix time global
  getTimeNow() {
    // Waktu di zona waktu Indonesia Barat (WIB)
    const waktuWIB = this.getTimeInZone('Asia/Jakarta');

    //console.log(waktuWIB);

    // Waktu di zona waktu Indonesia Tengah (WITA)
    const waktuWITA = this.getTimeInZone('Asia/Makassar');
    //console.log('Waktu WITA (Asia/Makassar):', waktuWITA);

    // Waktu di zona waktu Indonesia Timur (WIT)
    const waktuWIT = this.getTimeInZone('Asia/Jayapura');
    //console.log('Waktu WIT (Asia/Jayapura):', waktuWIT);

    return new Date(waktuWIB);
  }

  /**
   * Realtime screen size detection
   * cara menggunakan isMobile(), isTablet(), isDesktop()
   */
  isMobile = computed(() => this.screenSize() === 'mobile');
  isTablet = computed(() => this.screenSize() === 'tablet');
  isDesktop = computed(() => this.screenSize() === 'desktop');

  /**
   * Download file from Blob data.
   * @param data - Blob data of the file.
   * @param filename - Name of the file to be downloaded.
   */
  //MARK: DOWNLOAD FILE
  downloadFile(data: any, filename: string) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  //MARK: STORAGE
  setStorage(key: string, value: any) {
    return lastValueFrom(this.storage.set(key, value));
  }

  getStorage(key: string) {
    return lastValueFrom(this.storage.get(key));
  }

  removeStorage(key: string) {
    return lastValueFrom(this.storage.delete(key));
  }

  /**
 * Menampilkan file dalam tab baru atau sebagai iframe.
 * @param file - File atau URL string yang akan ditampilkan.
 */
  //MARK: SHOW FILE
  showFile(file: File | string) {
    if (typeof file === 'string') {
      const newTab = window.open(file, '_blank');
      if (!newTab) {
        this.showPopup('error', 'Maaf', 'Unable to open file.');
      }
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        if (e.target?.result) {
          const newTab = window.open();
          if (newTab) {
            newTab.document.body.innerHTML = `<iframe src="${e.target.result}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
          }
        }
      };
    }
  }

  async showLoading(message?: any) {
    return await this.listener.$loading.set({ load: true, message: message });
  }

  dismissLoading() {
    this.listener.$loading.set({ load: false, message: null });
  }

  routerLink(link: string) {
    this.router.navigateByUrl(link);
  }

  //--------------------------- POP UP-------------------------//
  showPopup(icon: any, title: any, msg: any, timer: boolean = false) {
    const confirmColor: Record<string, string> = {
      success: '#15A244',
      error: '#4C2DE1',
      warning: '#CC8E12',
      info: '#4C2DE1',
      question: '#206EE1',
    };

    Swal.fire({
      title: title,
      html: msg,
      icon: icon,
      timer: timer ? 3000 : undefined,
      timerProgressBar: timer,
      showConfirmButton: !timer,
      confirmButtonText: 'OK',
      confirmButtonColor: confirmColor[icon] ?? '#206EE1',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl!',
        title: 'text-2xl! font-semibold! text-[#272727]!',
        htmlContainer: 'text-lg! text-[#585858]!',
        actions: 'w-full! px-6! py-4! mt-0!',
        confirmButton: 'rounded-xl! w-40! h-10! text-sm! font-medium!',
      },
    });
  }

  dismissPopup() {
    Swal.close();
  }

  async confirmationAlert(data: Popup_m, strict = true): Promise<boolean> {
    // switch (data.type) {
    //   case 'delete':
    //     data.icon = 'icon-delete.svg';
    //     break;
    //   case 'success':
    //     data.icon = 'icon-success.svg';
    //     break;
    //   case 'confirm':
    //     data.icon = 'icon-confirm.svg';
    //     break;
    //   case 'suspend':
    //     data.icon = 'icon-suspend.svg';
    //     break;
    //   case 'change':
    //     data.icon = 'icon-edit.svg';
    //     break;
    //   case 'send':
    //     data.icon = 'icon-send.png';
    //     break;
    //   case 'restore':
    //     data.icon = 'icon-restore.png';
    //     break;
    //   default:
    //     break;
    // }

    return Swal.fire({
      html: `
      <h5 class="text-[18px] lg:text-[24px] font-semibold mb-2 text-[#272727]">${data.title}</h5>
      <div class="text-[#272727]! text-[16px] leading-[1.2]">${data.message}</div>
    `,

      icon: data.icon ? 'info' : undefined,
      showCancelButton: data?.showCancel ?? true,
      confirmButtonText: data.button,
      cancelButtonText: data?.button_cancel ? data.button_cancel : 'Batal',
      reverseButtons: true,

      confirmButtonColor: data.type == 'delete' ? '#D12114' : '#0072B9',
      customClass: {
        cancelButton: 'custom-cancel-button',


      },

      allowOutsideClick: strict,   // klik luar modal
      allowEscapeKey: strict,      // tombol ESC
      allowEnterKey: strict,       // enter (opsional)
      showCloseButton: strict,
    }).then((result) => result.isConfirmed);
  }


  currentUrl() {
    return this.router.url;
  }






}
