import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private headers = new HttpHeaders();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  /**
   * Get
   */
  public makeGetRequest(url: string): Observable<any> {
    return this.http.get(url).pipe(
      tap((_) => {}),
      catchError((err) => {
        this.snackBar.open('Error while loading. Try refreshing!', '', {
          duration: 1000,
        });
        return throwError(err);
      })
    );
  }

  makeGetRequestWithHeader(url: any, headerKey: any, headerValue: any): any {
    this.headers = this.headers;
    return this.http
      .get(url, { headers: this.headers.set(headerKey, headerValue) })
      .pipe(
        tap((_) => {}),
        catchError((err) => {
          this.snackBar.open('Error while loading. Try refreshing!', '', {
            duration: 1000,
          });
          return throwError(err);
        })
      );
  }

  public makeGetRequestWithParams(url: any, payload: any): Observable<any> {
    var query = '';
    var params = payload;
    for (var key in params) {
      query +=
        encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
    }
    query = query.substring(0, query.length - 1);
    url += '?' + query;
    return this.makeGetRequest(url);
  }

  public makeFullGetRequest(url: string): Observable<any> {
    return this.http.get(url, { observe: 'response' }).pipe(
      tap((_) => {}),
      catchError((err) => {
        this.snackBar.open('Error while loading. Try refreshing!', '', {
          duration: 1000,
        });
        return throwError(err);
      })
    );
  }

  public makeFullGetRequestWithParams(url: any, payload: any): Observable<any> {
    var query = '';
    var params = payload;
    for (var key in params) {
      query +=
        encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
    }
    query = query.substring(0, query.length - 1);
    url += '?' + query;
    return this.makeFullGetRequest(url);
  }

  /**
   * Post
   */
  makePostRequestWithHeader(
    url: any,
    payload: any,
    headerKey: any,
    headerValue: any
  ): any {
    this.headers = this.headers;
    return this.http
      .post(url, payload, { headers: this.headers.set(headerKey, headerValue) })
      .pipe(
        tap((_) => {}),
        catchError((err) => {
          this.snackBar.open('Error while loading. Try refreshing!', '', {
            duration: 1000,
          });
          return throwError(err);
        })
      );
  }

  private makePostRequest(url: string, payload: any): Observable<any> {
    return this.http.post(url, payload).pipe(
      tap((_) => {}),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  makePostRequestWithHeaders(
    url: any,
    payload: any,
    headers: any
  ): Observable<any> {
    this.headers = this.headers;
    return this.http.post(url, payload, { headers: headers }).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  public makeFormPostRequest(url: string, payload: any): Observable<any> {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let input = new FormData();
    var params = payload;
    for (var key in params) {
      input.append(key, params[key]);
    }
    return this.makePostRequest(url, input);
  }

  public makeJsonPostRequest(url: string, payload: any): Observable<any> {
    this.headers.append('Content-Type', 'application/json');
    return this.makePostRequest(url, payload);
  }

  public makeFormDataPostRequest(
    url: string,
    fileToUpload: File,
    fileKey: string
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append(fileKey, fileToUpload, fileToUpload.name);
    return this.http.post(url, formData, { observe: 'response' }).pipe(
      tap((_) => {}),
      catchError((err) => {
        this.snackBar.open('Error while loading. Try refreshing!', '', {
          duration: 1000,
        });
        return throwError(err);
      })
    );
  }

  public makeFormDataPostRequestWithParams(
    url: string,
    fileToUpload: File,
    fileKey: string,
    params: any
  ): Observable<any> {
    var query = '';
    for (var key in params) {
      query +=
        encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
    }
    query = query.substring(0, query.length - 1);
    url += '?' + query;

    const formData: FormData = new FormData();
    formData.append(fileKey, fileToUpload, fileToUpload.name);
    return this.http.post(url, formData, { observe: 'response' }).pipe(
      tap((_) => {}),
      catchError((err) => {
        this.snackBar.open('Error while loading. Try refreshing!', '', {
          duration: 1000,
        });
        return throwError(err);
      })
    );
  }

  /**
   * Put
   */
  public makePutRequest(url: string, payload: any): Observable<any> {
    return this.http.put(url, payload, { observe: 'response' }).pipe(
      tap((_) => {}),
      catchError((err) => {
        this.snackBar.open('Error while loading. Try refreshing!', '', {
          duration: 1000,
        });
        return throwError(err);
      })
    );
  }

  public makeExternalFormPostRequest(
    url: string,
    payload: any
  ): Observable<any> {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let input = new FormData();
    var params = payload;
    for (var key in params) {
      input.append(key, params[key]);
    }
    return this.http.post(url, input).pipe(
      tap((_) => console.log('request completed')),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
