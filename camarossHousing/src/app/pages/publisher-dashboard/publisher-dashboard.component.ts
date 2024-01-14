import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
import { PublisherService } from '../../service/publisher.service';
import { IPublisher } from '../../models/publisher.model';
import { throwError } from 'rxjs';
import { Register } from '../../models/properties.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publisher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publisher-dashboard.component.html',
  styleUrl: './publisher-dashboard.component.css',
})
export class PublisherDashboardComponent implements OnInit {
  nameUser: string = '';
  token: string | null = null;
  idUser: string = '';
  publisher: IPublisher | null = null;
  register: Register[] | null = null;

  private _authService = inject(AuthServiceService);
  private _apiService = inject(ApiService);
  private _publisherService = inject(PublisherService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.chargingData();
  }

  private async chargingData() {
    this.token = this._authService.getToken();
    const storedUserName = localStorage.getItem('userName');
    this.nameUser = storedUserName !== null ? storedUserName : '';

    if (!this.token || !this.nameUser) {
      this._authService.handleInvalidToken();
      return;
    }
    await this._authService.checkAuthService().subscribe((verify) => {
      if (verify) {
        this.token = this._authService.getToken();
        this.loadPublisher();
      } else {
        this._authService.handleInvalidToken();
        this.redirectToLogin();
      }
    });

  }
  private async loadPublisher() {
    await this._publisherService
      .getUserName(this.nameUser, this.token)
      .subscribe(async (term) => {
        this.idUser = term.id;
        localStorage.setItem('hjid', this.idUser);
        await this._publisherService
          .getPublisher(this.idUser, this.token!)
          .subscribe(async (term: IPublisher) => {
            if (!(term == null)) {
              this.publisher = term;
              await this._publisherService
                .getProperties(this.publisher.id, this.token!)
                .subscribe((data: Register[]) => {
                  this.register = data;
                });
            } else {
              this.redirectToProfile();
            }
          });
      });
  }

  private async loadPropertiesPublisher(){

  }
  private redirectToLogin() {
    this._router.navigate(['/login']);
  }
  redirectToProfile() {
    this._router.navigate(['/publisher-dashboard/profile']);
  }
}
