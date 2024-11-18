import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  returnUrl: string = '';
  query: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email, this.noWhitespaceValidator]],
      password: ['', [Validators.required, this.passwordValidator, this.noWhitespaceValidator]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
      this.query = params['query'] || '';
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value.username,
        this.loginForm.value.password
      ).subscribe(response => {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';
        const token = response; // Assuming the response contains the token
        const expiresIn = 1800; // Set expiration time to 30 minutes (1800 seconds)
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        localStorage.setItem('authToken', token);
        localStorage.setItem('tokenExpiration', expirationDate.toString());

        this.authService.setLoginStatus(true); // Step 1: Set login status

        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        setTimeout(() => {
          this.successMessage = '';
        }, 3000); // Hide the success message after 3 seconds
        this.loginForm.reset();
        this.router.navigate([this.returnUrl], { queryParams: { query: this.query } });
      }, error => {
        this.errorMessage = 'Login failed. Please try again.';
        this.successMessage = '';

        this.snackBar.open('Login failed. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000); // Hide the error message after 3 seconds
      });
    }
  }
  passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && value.length >= 8;

    return isValid ? null : { 'passwordStrength': true }; // Return error object if password is invalid
  };

  noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}
