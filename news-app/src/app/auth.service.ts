import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8088/api/v1/users';
  private authUrl = 'http://localhost:8088/auth/generateToken';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Step 1: Create BehaviorSubject

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedInSubject.next(!!localStorage.getItem('authToken')); // Set initial value
    }
  }

  register(email: string, firstName: string, lastName: string, phoneNumber: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register?password=${password}`, {
      email,
      firstName,
      lastName,
      phoneNumber
    }, { responseType: 'text' });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.authUrl, { username, password }, { responseType: 'text' });
  }

  // Step 2: Add method to get login status as an observable
  getLoginStatus(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Step 3: Add method to update login status
  setLoginStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('currentQuery');
      localStorage.removeItem('currentPage');
      this.setLoginStatus(false); // Update the login status
    }
  }

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
      this.setLoginStatus(true); // Update the login status when token is set
    }
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null; // or handle accordingly if not in the browser
  }
}
