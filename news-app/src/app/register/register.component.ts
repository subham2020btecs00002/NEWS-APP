import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, this.noWhitespaceValidator]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Mobile number validator
      password: ['', [Validators.required, this.noWhitespaceValidator]],
      confirmPassword: ['', [Validators.required, this.noWhitespaceValidator]],
    }, { validators: this.passwordMatchValidator }); // Add password matching validator
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(
        this.registerForm.value.email,
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.phoneNumber,
        this.registerForm.value.password
      ).subscribe(response => {
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.registerForm.reset();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000); // Hide the success message after 3 seconds
      }, error => {
        this.snackBar.open('User already exists. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000); // Hide the error message after 3 seconds
      });
    }
  }

  noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }
}
