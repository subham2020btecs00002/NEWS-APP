import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'; // Import FormBuilder and Validators

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  email: string = '';
  changePasswordForm: FormGroup;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, this.passwordValidator]]
    }, { validator: this.passwordsNotSame });
  }

  ngOnInit() {
    this.setEmailFromToken();
  }

  setEmailFromToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.email = payload.sub || '';
        this.changePasswordForm.patchValue({ email: this.email });
      } catch (error) {
        console.error('Invalid token:', error);
        this.router.navigate(['/login']);
      }
    }
  }

  passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && value.length >= 8;

    return isValid ? null : { 'passwordStrength': true };
  };

  passwordsNotSame: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const oldPassword = group.get('oldPassword')?.value;
    const newPassword = group.get('newPassword')?.value;
    return oldPassword && newPassword && oldPassword === newPassword ? { 'passwordsSame': true } : null;
  };

  changePassword() {
    if (this.changePasswordForm.invalid) {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    const url = 'http://localhost:8088/auth/changePassword';
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      email: this.email,
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword
    };

    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        this.snackBar.open('Password changed successfully! Logging out in 3 seconds.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });

        this.authService.logout();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error changing password. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      }
    });
  }
}
