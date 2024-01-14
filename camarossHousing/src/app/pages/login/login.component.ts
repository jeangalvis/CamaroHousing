import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { AuthServiceService } from '../../service/auth-service.service';
import { TokenRefreshServiceService } from '../../service/token-refresh-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showErrors: boolean = false;
  RefusedMessage: string = '';
  successMessage: string = '';
  ErrorMessage: string = '';

  private _apiService = inject(ApiService);
  private _router = inject(Router);
  private _authService = inject(AuthServiceService);

  constructor(private formbuilder: FormBuilder,private _tokenRefreshService: TokenRefreshServiceService) {
    this.loginForm = this.formbuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
        ],
      ],
    });
  }
  ngOnInit(): void {
    this._tokenRefreshService.startTokenRefreshTimer();
  }
  onSubmit(event: Event): void {
    event.preventDefault();
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity({
      onlySelf: false,
      emitEvent: false,
    });

    const { username, password } = this.loginForm.value;
    if (this.loginForm.valid) {
      this._apiService.LoginUser(username, password).subscribe({
        next: (response: any) => {
          const { message, isAuthenticated, userName, roles, token } = response;
          if (isAuthenticated === false) {
            this._authService.NotAuthenticated();
            this.RefusedMessage = 'El usuario o la contraseña son incorrectos';
          } else {
            this._authService.authenticateUser();
            localStorage.removeItem('userName');
            this._authService.removeToken();
            localStorage.setItem('userName', userName);
            this._authService.setToken(token);
            this.successMessage = `Usuario: ${username} ingresado correctamente.`;
            if (roles && roles.includes('Administrator')) {
              setTimeout(() => {
                this._router.navigate(['/admin-dashboard']);
              }, 2000);
            } else if (roles && roles.includes('Publisher')) {
              setTimeout(() => {
                this._router.navigate(['/publisher-dashboard']);
              }, 2000);
            }
          }
        },
        error: (error) => {
          console.error('Error en el ingreso:', error.error);
          this.ErrorMessage = `Ha habido un problema al ingresar, Vuelve a intentarlo mas tarde.`;
        },
      });
    } else {
      this.showErrors = true;
    }
  }
  hasErrors(field: string, typeError: string) {
    const control = this.loginForm.get(field);
    return (
      this.showErrors &&
      control &&
      control.hasError(typeError) &&
      control.touched
    );
  }
}
