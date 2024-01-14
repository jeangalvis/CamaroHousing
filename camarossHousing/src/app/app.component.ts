import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService } from 'ngx-mask';
import { NgxMaskApplierService } from 'ngx-mask/lib/ngx-mask-applier.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from './service/auth-service.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    HttpClientModule,
    FooterComponent,
    HeaderComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'camarossHousing';

  constructor(private authService: AuthServiceService) {}
  ngOnInit(): void {
    this.authService.checkAuthenticationOnLoad();
  }
}
