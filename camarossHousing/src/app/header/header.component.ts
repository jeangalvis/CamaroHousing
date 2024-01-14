import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthServiceService } from '../service/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  menuOption: string = '';
  isAuthenticated: boolean = false;
  username: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _authService: AuthServiceService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveOption();
      });
  }
  ngOnInit(): void {
    this._authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.username = this._authService.getUsername();
    });
  }

  onOption(option: string): void {
    this.menuOption = option;
  }
  onLogout(): void{
    this._authService.logout();
  }
  private updateActiveOption(): void {
    const currentRoute = this.route.root.firstChild?.routeConfig?.path;

    switch (currentRoute) {
      case '':
        this.menuOption = 'home';
        break;
      case 'properties':
        this.menuOption = 'properties';
        break;
      case 'publisher-dashboard':
        this.menuOption = 'publisher-dashboard';
        break;
      case 'login':
        this.menuOption = 'login';
        break;
      case 'register':
        this.menuOption = 'register';
        break;
      default:
        this.menuOption = '**';
    }
  }
}
