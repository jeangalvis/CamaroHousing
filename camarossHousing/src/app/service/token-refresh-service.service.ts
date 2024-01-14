import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { EMPTY, catchError, interval, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenRefreshServiceService {
  constructor(private _authService: AuthServiceService) {}

  startTokenRefreshTimer(): void {
    interval(1200000)
      .pipe(
        switchMap(() => this._authService.refreshAccessToken()),
        catchError((error) => {
          console.error('Error refreshing token:', error);
          return EMPTY;
        }),
        take(1)
      )
      .subscribe({
        next: (response) => {
          this._authService.handleRefreshTokenResponse(response);
        },
        error: (error) => {
          console.error('Error al renovar el token.', error);
        },
      });
  }

}
