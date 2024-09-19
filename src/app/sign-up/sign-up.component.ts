import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signUpWithEmail(email, password);
    // After successful sign-up, navigate to the sign-in page
    if (email && password) {
      console.log('Sign-up successful with email:', email);
      this.router.navigate(['/sign-in']);
    }
  }
}