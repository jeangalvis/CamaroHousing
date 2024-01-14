import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { PropertiesDetailComponent } from './pages/properties-detail/properties-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PublisherDashboardComponent } from './pages/publisher-dashboard/publisher-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'properties/:id', component: PropertiesDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'publisher-dashboard', component: PublisherDashboardComponent },
  { path: 'publisher-dashboard/profile', component: ProfileComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
