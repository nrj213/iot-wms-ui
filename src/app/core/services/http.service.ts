import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {

  hostAddress: string = environment.hostAddress;

  constructor(private http: HttpClient) { }

  get(url): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>(this.hostAddress + url)
  }

  post(url, payload): Observable<HttpResponse<Object>> {
    return this.http.post<HttpResponse<Object>>(this.hostAddress + url, payload)
  }

  put(url, payload): Observable<HttpResponse<Object>> {
    return this.http.put<HttpResponse<Object>>(this.hostAddress + url, payload)
  }

  delete(url): Observable<HttpResponse<Object>> {
    return this.http.delete<HttpResponse<Object>>(this.hostAddress + url)
  }

}