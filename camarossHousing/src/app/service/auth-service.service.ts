import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  map,
  of,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private _http = inject(HttpClient);
  private tokenKey = 'token';
  private refreshTokenUrl = 'http://localhost:5249/api/User/refresh-token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  private _router = inject(Router);


  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  getUsername(): string | null {
    return localStorage.getItem('userName') || '';
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  authenticateUser() {
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('isAuthenticated', 'true');
  }

  NotAuthenticated() {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isAuthenticated');
  }
  checkAuthenticationOnLoad() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  isTokenExpired(token: string | null): boolean {
    if (!token) {
      return true;
    }

    try {
      const decoded: any = jwtDecode(token);

      if (decoded.exp) {
        return Date.now() >= decoded.exp * 1000;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  refreshAccessToken(): Observable<any> {
    const token = this.getToken();

    if (!token) {
      return EMPTY;
    }

    return this._http
      .post(this.refreshTokenUrl, null, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(catchError(() => EMPTY));
  }
  handleRefreshTokenResponse(response: any): void {
    if (response.isAuthenticated) {
      this.removeToken();
      this.setToken(response.token);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
      this.handleInvalidToken();
    }
  }
  handleInvalidToken() {
    this.isAuthenticatedSubject.next(false);
    this.removeToken();
    localStorage.removeItem('userName');
    localStorage.removeItem('hjid');
    this.NotAuthenticated();
    this.redirectToLogin();
  }

  checkAuthService(): Observable<boolean> {
    const token = this.getToken();

    if (!token) {
      return of(false);
    }

    if (this.isTokenExpired(token)) {
      return this.refreshAccessToken().pipe(
        map((response) => {
          if (response.isAuthenticated) {
            this.setToken(response.token);
            this.isAuthenticatedSubject.next(true);
            return true;
          } else {
            this.isAuthenticatedSubject.next(false);
            return false;
          }
        }),
        catchError(() => of(false))
      );
    }
    this.isAuthenticatedSubject.next(true);
    return of(true);
  }

  private redirectToLogin() {
    this._router.navigate(['/login']);
  }
  clearCookies(cookieName: string): void {
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
  logout(){
    this.isAuthenticatedSubject.next(false);
    this.removeToken();
    localStorage.removeItem('userName');
    localStorage.removeItem('hjid');
    this.clearCookies('refreshToken');
    this.NotAuthenticated();
    this.redirectToLogin();
  }
}
