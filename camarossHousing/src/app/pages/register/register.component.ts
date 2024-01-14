import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { IRegister } from '../../models/register.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  register: IRegister | undefined;
  successMessage: string | null = null;
  ErrorMessage: string | null = null;
  userRegisteredMessage: string | null = null;
  registerForm!: FormGroup;
  showErrors: boolean = false;

  private _apiService = inject(ApiService);
  private _router = inject(Router);

  constructor(private formbuilder: FormBuilder) {
    this.registerForm = this.formbuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
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
        verifyPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  onSubmit(event: Event): void {
    event.preventDefault();
    this.registerForm.markAllAsTouched();
    this.registerForm.updateValueAndValidity({
      onlySelf: false,
      emitEvent: false,
    });
    const { email, username, password } = this.registerForm.value;
    if (this.registerForm.valid) {

      if (this.passwordMatchValidator(this.registerForm) === null) {
        this._apiService
          .RegisterUser(email, username, password)
          .subscribe({
            next: (response: string) => {
              console.log(response);
              if (response === `User ${username} already registered.`) {
                this.userRegisteredMessage =
                  'El correo electronico o el usuario ya estan registrados';
              } else {
                this.successMessage = `Usuario ${username} registrado satisfactoriamente.`;
                setTimeout(() => {
                  this._router.navigate(['/login']);
                }, 2000);
              }
            },
            error: (error) => {
              console.error('Error en el registro:', error.error);
              this.ErrorMessage = `Ha habido un problema al registrarse, Vuelve a intentarlo.`;
            },
          });
      }
    } else {
      this.showErrors = true;
    }
  }
  hasErrors(field: string, typeError: string) {
    const control = this.registerForm.get(field);
    return (
      this.showErrors &&
      control &&
      control.hasError(typeError) &&
      control.touched
    );
  }
  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const verifyPassword = formGroup.get('verifyPassword')?.value;

    return password === verifyPassword ? null : { mismatch: true };
  }
}
