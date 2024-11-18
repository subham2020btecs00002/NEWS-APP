// wishlist.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  searchKeyword: string = ''; // Add this for search input

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object,private snackBar: MatSnackBar) {}

  ngOnInit() {
    const token = this.getAuthToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded payload:', payload); // Log the entire payload
  
    this.email = payload.sub ; // Adjust based on actual key
    console.log(this.email);
    this.loadWishlist(token);

    }

  getAuthToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      console.log(localStorage.getItem('authToken'));
      return localStorage.getItem('authToken');
    }
    return null;
  }

  loadWishlist(token: string) {
    console.log('Fetching wishlist for:', this.email);
    this.http.get(`http://localhost:8088/api/wishlist/user/${this.email}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((response: any) => {
      this.wishlist = response; // Adjust based on your response structure
    }, error => {
      console.error('Error fetching wishlist', error);
    });
  }
  // New method to handle search
  searchWishlist() {
    const token = this.getAuthToken();
    console.log(token);
    if (token) {
      const searchUrl = `http://localhost:8088/api/wishlist/search?keyword=${this.searchKeyword}`;
      this.http.get(searchUrl, { headers: { Authorization: `Bearer ${token}` } }).subscribe(
        (response: any) => {
          this.wishlist = response;
        },
        (error) => {
          console.error('Error searching wishlist', error);
          this.snackBar.open('Error searching wishlist.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      );
    }
  }
  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchWishlist();
    }
  }


  deleteWishlistItem(id: number) {
    const token = this.getAuthToken();;
    if (token) {
      this.http.delete(`http://localhost:8088/api/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        () => {
          this.snackBar.open('Item removed from wishlist.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.loadWishlist(token);
        },
        error => {
          console.error('Error removing item from wishlist', error);
          this.snackBar.open('Item Already Exist in wishlist.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      );
    }
  }
  }
