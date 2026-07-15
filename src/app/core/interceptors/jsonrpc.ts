import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { logger } from '@shared/utils/logger';
import { delay, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class AbstractApiService<T> {
  constructor(protected http: HttpClient, protected path: string) {}

  protected createCustomHeaders(headers: {
    [key: string]: string;
  }): HttpHeaders {
    let customHeaders = new HttpHeaders();
    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        customHeaders = customHeaders.set(key, headers[key]);
      }
    }
    return customHeaders;
  }

  async export2(endpointURL?: string): Promise<any> {
    return lastValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}` + (endpointURL ? endpointURL : this.path),
        { responseType: 'blob' as 'json' }
      )
    );
  }

  async exportPost(data: any, endpointURL?: string, param?: any): Promise<any> {
    return lastValueFrom(
      this.http.post<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + new HttpParams({ fromObject: param }).toString() : ''),
        data,
        { responseType: 'blob' as 'json' }
      )
    );
  }

  //MARK:GET
  async getAll(params?: any, endpointURL?: string): Promise<any> {
    let param = new HttpParams({ fromObject: params }).toString();
    return lastValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + param : '')
      )
    );
  }

  async getById(id?: any, endpointURL?: string): Promise<any> {
    return lastValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          '/' +
          id
      )
    );
  }

  async get(endpointURL?: string): Promise<any> {
    return lastValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}` + (endpointURL ? endpointURL : this.path)
      )
    );
  }

  async getURL(url: string): Promise<any> {
    return lastValueFrom(this.http.get<any>(url));
  }

  //MARK:POST

  async post(data: any, endpointURL?: string, param?: any): Promise<any> {
    let params;
    if (param) {
      params = new HttpParams({ fromObject: param }).toString();
    }
    return lastValueFrom(
      this.http.post<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (params ? '?' + params : ''),
        data
      )
    );
  }

  //POST with form data

  async post_formdata_edited_array(
    data: any,
    endpointURL?: string,
    params?: any
  ): Promise<any> {
    let param = new HttpParams({ fromObject: params }).toString();
    let body = new FormData();

    for (var key in data) {
      // body.append(key, data[key]);

      if (data[key] == null) {
        body.append(key, '');
        continue;
      }

      if (Array.isArray(data[key])) {
        data[key].forEach((item: any) => {
          body.append(`${key}[]`, item);
        });
      } else {
        body.append(key, data[key]);
      }
    }

    return lastValueFrom(
      this.http.post<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + param : ''),
        body,
        {
          headers: this.createCustomHeaders({
            Accept: 'application/json',
            // Add any other headers you need here
          }),
        }
      )
    );
  }

  async acces_custom(endpointURL?: string, token?: any) {
    return lastValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}` + (endpointURL ? endpointURL : this.path),
        {
          headers: this.createCustomHeaders({
            // Accept: 'application/json',
            Authorization: `Bearer ${token}`, // Assuming token is a string
            'Content-Type': 'application/json', // Set content type if needed
            // Add any other headers you need here
          }),
        }
      )
    );
  }

  async post_formdata(
    data: any,
    endpointURL?: string,
    params?: any
  ): Promise<any> {
    let param = new HttpParams({ fromObject: params }).toString();
    let body = new FormData();

    for (var key in data) {
      // body.append(key, data[key]);

      if (Array.isArray(data[key])) {
        data[key].forEach((item: any) => {
          body.append(key, item == null ? '' : item);
        });
      } else {
        body.append(key, data[key] == null ? '' : data[key]);
      }
    }

    return lastValueFrom(
      this.http.post<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + param : ''),
        body,
        {
          headers: this.createCustomHeaders({
            Accept: 'application/json',
            // Add any other headers you need here
          }),
        }
      )
    );
  }

  //MARK:PUT
  async putId(id: number | string, data: T, endpointURL?: string): Promise<T> {
    return lastValueFrom(
      this.http.put<T>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          '/' +
          id,
        data
      )
    );
  }

  async put_custom(data: any, endpointURL?: string, params?: any): Promise<T> {
    let param = new HttpParams({ fromObject: params }).toString();
    return lastValueFrom(
      this.http.put<T>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + param : ''),
        data
      )
    );
  }

  //put with form data
  async put_formdata(
    data: any,
    endpointURL?: string,
    params?: any
  ): Promise<Response> {
    let param = new HttpParams({ fromObject: params }).toString();
    let body = new FormData();
    for (var key in data) {
      body.append(key, data[key]);
    }

    return lastValueFrom(
      this.http.put<Response>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + param : ''),
        body,
        {
          headers: this.createCustomHeaders({
            Accept: 'application/json',
            // Add any other headers you need here
          }),
        }
      )
    );
  }

  //MARK:DELETE
  async delete(id: number | string, endpointURL?: string): Promise<Response> {
    return lastValueFrom(
      this.http.delete<Response>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          '/' +
          id
      )
    );
  }
  async delete_param(params?: any, endpointURL?: string): Promise<any> {
    let param = new HttpParams({ fromObject: params }).toString();
    return lastValueFrom(
      this.http.delete<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + param : '')
      )
    );
  }

  //MARK:PATCH
  async patch(
    id: number | string,
    partialdata: Partial<T>,
    endpointURL?: string
  ): Promise<T> {
    return lastValueFrom(
      this.http.patch<T>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          '/' +
          id,
        partialdata
      )
    );
  }

  async post_formdata_custom(
    data: any,
    endpointURL?: string,
    params?: any
  ): Promise<any> {
    let param = new HttpParams({ fromObject: params }).toString();
    let body = this.jsonToFormData(data);

    return lastValueFrom(
      this.http.post<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + param : ''),
        body,
        {
          headers: this.createCustomHeaders({
            Accept: 'application/json',
            // Add any other headers you need here
          }),
        }
      )
    );
  }

  async put_formdata_custom(
    data: any,
    endpointURL?: string,
    params?: any
  ): Promise<any> {
    let param = new HttpParams({ fromObject: params }).toString();
    let body = this.jsonToFormData(data);

    return lastValueFrom(
      this.http.post<any>(
        `${environment.apiUrl}` +
          (endpointURL ? endpointURL : this.path) +
          (param ? '?' + param : ''),
        body,
        {
          headers: this.createCustomHeaders({
            Accept: 'application/json',
            // Add any other headers you need here
          }),
        }
      )
    );
  }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = this.http.post('/api/upload', formData, {
      reportProgress: true,
      observe: 'events',
    });

    return req;
  }

  consoleFormData(payload: any) {
    const form = this.jsonToFormData(payload);
    for (const [key, value] of form.entries()) {
      console.log(`${key}: ${value}`);
    }

    logger.log('Form Data:', form);
  }

  jsonToFormData(
    json: any,
    formData: FormData = new FormData(),
    parentKey: string = ''
  ): FormData {
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const value = json[key];

        //console.log(value);
        const newKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Rekursif untuk nested object
          if (value instanceof File) {
            formData.append(newKey, value);
          } else {
            this.jsonToFormData(value, formData, newKey);
          }
        } else if (Array.isArray(value)) {
          // Tangani array
          value.forEach((item, index) => {
            if (item && typeof item === 'object' && item.id !== undefined) {
              // Array berisi objek dengan id

              if (item?.isObject) {
                for (const subKey in item) {
                  if (item.hasOwnProperty(subKey) && subKey != 'isObject') {
                    const subValue = item[subKey];
                    const newSubKey = `${newKey}[${item.id}][${subKey}]`;
                    if (subValue && typeof subValue === 'object') {
                      // this.jsonToFormData(subValue, formData, newSubKey);
                      formData.append(newSubKey, !subValue ? '' : subValue);
                    } else {
                      formData.append(newSubKey, !subValue ? '' : subValue);
                    }
                  }
                }
              } else {
                formData.append(
                  `${newKey}[${item.id}]`,
                  item?.value ? item.value : ''
                );
              }
            } else {
              // Array berisi objek sederhana
              if (item?.isObject) {
                for (const subKey in item) {
                  if (item.hasOwnProperty(subKey) && subKey != 'isObject') {
                    const subValue = item[subKey];
                    const newSubKey = `${newKey}[${index}][${subKey}]`;
                    if (subValue && typeof subValue === 'object') {
                      // this.jsonToFormData(subValue, formData, newSubKey);
                      formData.append(newSubKey, !subValue ? '' : subValue);
                    } else {
                      formData.append(newSubKey, !subValue ? '' : subValue);
                    }
                  }
                }
              } else {
                // Array berisi nilai sederhana
                formData.append(
                  `${newKey}[${index}]`,
                  item === null || item === undefined ? '' : item
                );
              }
            }
          });

          if (value.length === 0) {
            formData.append(`${newKey}[]`, '');
          }
        } else {
          // Nilai sederhana langsung append ke FormData
          formData.append(
            newKey,
            value === null || value === undefined ? '' : value
          );
        }
      }
    }
    return formData;
  }
}
