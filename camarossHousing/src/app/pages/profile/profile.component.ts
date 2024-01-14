import { Component, OnInit, inject } from '@angular/core';
import { PublisherService } from '../../service/publisher.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { IPublisher } from '../../models/publisher.model';
import { CommonModule, NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { TokenRefreshServiceService } from '../../service/token-refresh-service.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  token: string | null = null;
  idUser: string = '';
  publisher: IPublisher | null = null;
  nombre: string = '';
  apellido: string = '';
  nombreComercial: string = '';
  telefono: string = '';
  infoForm!: FormGroup;
  showErrors: boolean = false;
  RefusedMessage: string = '';
  successMessage: string = '';
  ErrorMessage: string = '';

  private _publisherService = inject(PublisherService);
  private _authService = inject(AuthServiceService);
  private _router = inject(Router);

  constructor(private formbuilder: FormBuilder) {
    this.infoForm = formbuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      nombreComercial: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.ChargingData();
  }

  private async ChargingData() {
    const storedIdUser = localStorage.getItem('hjid');
    this.idUser = storedIdUser !== null ? storedIdUser : '';
    this.token = this._authService.getToken();

    if (!this.token || !this.idUser) {
      this._authService.handleInvalidToken();
      return;
    }

    await this._authService.checkAuthService().subscribe((verify) => {
      if (verify) {
        this.token = this._authService.getToken();
        this.loadPublisherData();
      } else {
        this._authService.handleInvalidToken();
        this.redirectToLogin();
      }
    });
  }

  private async loadPublisherData() {
    try {
      const term: IPublisher | null = await firstValueFrom(
        this._publisherService.getPublisher(this.idUser, this.token!)
      );

      if (term !== undefined) {
        this.publisher = term;
        this.infoForm.patchValue({
          nombre: term.nombre,
          apellido: term.apellido,
          nombreComercial: term.nombreComercial,
          telefono: term.telefono,
        });
      } else {
        console.error('Publisher data is undefined');
        this.redirectToLogin();
      }
    } catch (error) {
      console.error('Error loading publisher data:', error);
      this.redirectToLogin();
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.token = this._authService.getToken();
    this.infoForm.markAllAsTouched();
    this.infoForm.updateValueAndValidity({
      onlySelf: false,
      emitEvent: false,
    });
    const { nombre, apellido, nombreComercial, telefono } = this.infoForm.value;
    if (this.infoForm.valid) {
      if (this.publisher) {
        this.onActualizar();
      } else {
        this._publisherService
          .setPublisher(
            nombre,
            apellido,
            nombreComercial,
            telefono,
            this.idUser,
            this.token!
          )
          .subscribe({
            next: (response: IPublisher) => {
              if (response !== null) {
                const { nombre, apellido, nombreComercial, telefono } =
                  response;
                this.nombre = nombre;
                this.nombreComercial = nombreComercial;
                this.apellido = apellido;
                this.telefono = telefono;
                this.successMessage = 'informacion guardada con exito.';
                setTimeout(() => {
                  this.redirectToDashboard();
                }, 1500);
              } else {
                this.RefusedMessage =
                  'Informacion suministrada no cumple con los estandares.';
              }
            },
            error: (error) => {
              console.error('Error en el ingreso:', error.error);
              this.ErrorMessage = `Ha habido un problema al ingresar, Vuelve a intentarlo mas tarde.`;
              if (error.status === 401) {
                setTimeout(() => {
                  this.redirectToLogin();
                }, 1500);
              } else {
                setTimeout(() => {
                  this.redirectToDashboard();
                }, 1500);
              }
            },
          });
      }
    } else {
      this.showErrors = true;
    }
  }
  onActualizar(): void {
    this.token = this._authService.getToken();
    this.infoForm.markAllAsTouched();
    this.infoForm.updateValueAndValidity({
      onlySelf: false,
      emitEvent: false,
    });
    const { nombre, apellido, nombreComercial, telefono } = this.infoForm.value;
    if (this.infoForm.valid) {
      if (this.publisher) {
        this._publisherService
          .updatePublisher(
            this.publisher.id,
            nombre,
            apellido,
            nombreComercial,
            telefono,
            this.idUser,
            this.token!
          )
          .subscribe({
            next: (response: any) => {
              this.successMessage = 'Información actualizada con éxito.';
              setTimeout(() => {
                this.redirectToDashboard();
              }, 1500);
            },
            error: (error) => {
              console.error('Error updating data:', error);
              this.ErrorMessage = `Ha habido un problema al ingresar, Vuelve a intentarlo mas tarde.`;
              if (error.status === 401) {
                setTimeout(() => {
                  this.redirectToLogin();
                }, 1500);
              } else {
                setTimeout(() => {
                  this.redirectToDashboard();
                }, 1500);
              }
            },
          });
      }
    } else {
      this.showErrors = true;
    }
  }

  private redirectToLogin() {
    this._router.navigate(['/login']);
  }
  private redirectToDashboard() {
    this._router.navigate(['publisher-dashboard']);
  }

  hasErrors(field: string, typeError: string) {
    const control = this.infoForm.get(field);
    return (
      this.showErrors &&
      control &&
      control.hasError(typeError) &&
      control.touched
    );
  }
}
