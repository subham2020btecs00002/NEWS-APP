import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  showLogout: boolean = false;
  navbarOpen: boolean = false; // New property to control the navbar toggle

  constructor(private router: Router, private route: ActivatedRoute, 
              @Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkLoginStatus();
    }

    this.authService.getLoginStatus().subscribe(status => { // Step 1: Subscribe to login status
      this.isLoggedIn = status;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  }

  checkRoute() {
    const currentRoute = this.router.url;
    this.showLogout = currentRoute.includes('/wishlist') || currentRoute.includes('/news') || currentRoute.includes('/dashboard') ;
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.logout(); // Use the logout method from AuthService
      this.router.navigate(['/login']);
    }
  }
  toggleNavbar() { // New method to toggle the navbarOpen property
    this.navbarOpen = !this.navbarOpen;
  }

}
