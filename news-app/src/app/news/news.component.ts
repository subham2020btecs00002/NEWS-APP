import { Component, Inject, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NewsService } from '../news.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  @ViewChild('topOfPage') topOfPage!: ElementRef;
  newsForm: FormGroup;
  articles: any[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 5; // Results per page
  totalResults: number = 0; // Total number of results returned from API

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.newsForm = this.fb.group({
      query: ['India News', [Validators.required, this.noWhitespaceValidator]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const query = params['query'];
      let storedQuery = '';
      let storedPage = '1'; // Default page number

      // Access localStorage safely if in the browser
      if (isPlatformBrowser(this.platformId)) {
        storedQuery = localStorage.getItem('currentQuery') || '';
        storedPage = localStorage.getItem('currentPage') || '1';
      }

      // Check if there is a stored query and page after login
      if (storedQuery && storedPage) {
        this.newsForm.patchValue({ query: storedQuery });
        this.currentPage = parseInt(storedPage);
        this.onSearch();

        // If an item was stored for the wishlist, add it after login
        const wishlistItem = isPlatformBrowser(this.platformId) ? localStorage.getItem('wishlistItem') : null;
        if (wishlistItem) {
          this.addToWishlistApiCall(JSON.parse(wishlistItem));
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('wishlistItem'); // Clear the stored item
          }
        }

        // Clear stored query and page
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentQuery');
          localStorage.removeItem('currentPage');
        }
      } else if (query) {
        this.newsForm.patchValue({ query: query });
        this.onSearch();
      } else {
        // If no query is found, use the existing form value
        this.newsForm.patchValue({ query: this.newsForm.value.query || '' });
      }

      // Set the query parameter in the URL to maintain state
      this.router.navigate([], {
        queryParams: { query: this.newsForm.value.query },
        queryParamsHandling: 'merge' // Merge with existing query parameters
      });
    });
  }
  
  onSearch() {
    if (this.newsForm.valid) {
      this.loading = true;
      const query = this.newsForm.value.query;
      const page = this.currentPage; // Pass current page for pagination
          // Store the query and page number in localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentQuery', query);
      localStorage.setItem('currentPage', page.toString());
    }

      this.newsService.searchNews(query, page, this.pageSize).subscribe(
        (response: any) => {
          this.articles = response.articles; // Adjust based on your response structure
          this.totalResults = response.totalResults; // Set total results
          this.loading = false;
        },
        (error) => {
          console.error('Search failed', error);
          this.loading = false;
        }
      );
    }
  }
  clearSearch() {
    this.newsForm.reset(); // Clear form input
    this.articles = []; // Clear search results
    this.currentPage = 1; // Reset pagination
  
    // Clear localStorage items related to search
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentQuery');
      localStorage.removeItem('currentPage');
    }
  
    //  Reset query parameter in URL
    this.router.navigate([], {
      queryParams: { query: null },
      queryParamsHandling: 'merge' // Remove the query parameter from the URL
    });
  }
  
  // Calculate total pages
  get totalPages(): number {
    return Math.ceil(this.totalResults / this.pageSize);
  }

  // Handle pagination navigation
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.onSearch();
      this.scrollToTop();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onSearch();
      this.scrollToTop();
    }
  }
  scrollToTop() {
    this.topOfPage.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  searchCategory(category: string) {
    this.newsForm.patchValue({ query: category });
    this.onSearch();
  }
  addToWishlist(article: any) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.addToWishlistApiCall(article); // Call the method to add the item to wishlist
      } else {
        // Store the current page, query, and article before redirecting
        localStorage.setItem('wishlistItem', JSON.stringify(article));
        localStorage.setItem('currentPage', this.currentPage.toString());
        localStorage.setItem('currentQuery', this.newsForm.value.query);

        // Redirect to login and pass the return URL
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/news', query: this.newsForm.value.query } });
      }
    }
  }
  
  private addToWishlistApiCall(article: any) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.http.post('http://localhost:8088/api/wishlist', article, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        response => {
          console.log('Added to wishlist:', response);
          this.snackBar.open('Item added to wishlist successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error => {
          console.error('Error adding to wishlist', error);
          this.snackBar.open('Failed to add item to wishlist.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      );
    }
  }
    isDarkMode = false;

// TypeScript
toggleDarkMode(event: any) {
  this.isDarkMode = event.target.checked;
  console.log('Dark mode toggled:', this.isDarkMode); // Debugging
  if (this.isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

  noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
} 
