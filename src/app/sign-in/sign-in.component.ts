import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(private authService: AuthService) {}

  onSignIn(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signInWithEmail(email, password);
  }

  onSignInGoogle() {
    this.authService.signInWithGoogle();
  }

  onSignInGithub() {
    this.authService.signInWithGithub();
  }
}

