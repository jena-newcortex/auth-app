import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';  // Import NgForm for form handling
import { HttpClient } from '@angular/common/http';  // To make backend request to launch Streamlit

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showIframe: boolean = false;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  // Submit form via ngForm
  onSubmit(signInForm: NgForm) {
    if (signInForm.valid) {
      this.authService.signInWithEmail(this.email, this.password)
        .then(user => {
          this.errorMessage = '';  // Clear any previous errors
          this.showIframe = false;  // Show iframe on successful login
          if (user.email) {
            this.launchStreamlitApp(user.email);  // Pass the email to launch Streamlit if email is not null
          }
        })
        .catch(error => {
          if (error.message === 'Your account is pending approval.') {
            this.errorMessage = 'Awaiting approval';  // Show approval error
          } else {
            this.errorMessage = 'Invalid login credentials';  // Invalid credentials
          }
          this.showIframe = false;  // Hide iframe on error
        });
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
      .then(user => {
        this.errorMessage = '';  // Clear any previous errors
        this.showIframe = false;  // Show iframe on successful login
        if (user.email) {
          this.launchStreamlitApp(user.email);  // Pass the email to launch Streamlit if email is not null
        }
      })
      .catch(error => {
        if (error.message === 'Your account is pending approval.') {
          this.errorMessage = 'Awaiting approval';  // Show approval error
        } else {
          this.errorMessage = 'Invalid login credentials';  // Invalid credentials
        }
        this.showIframe = false;  // Hide iframe on error
      });
  }

  signInWithGithub() {
    this.authService.signInWithGithub()
      .then(user => {
        this.errorMessage = '';  // Clear any previous errors
        this.showIframe = false;  // Show iframe on successful login
        if (user.email) {
          this.launchStreamlitApp(user.email);  // Pass the email to launch Streamlit if email is not null
        }
      })
      .catch(error => {
        if (error.message === 'Your account is pending approval.') {
          this.errorMessage = 'Awaiting approval';  // Show approval error
        } else {
          this.errorMessage = 'Invalid login credentials';  // Invalid credentials
        }
        this.showIframe = false;  // Hide iframe on error
      });
  }

  // Function to launch the Streamlit app with the email as an argument
  launchStreamlitApp(email: string) {
    // Call a backend API to launch Streamlit with the email
    this.http.post('/api/launch-streamlit', { email }).subscribe(response => {
      console.log('Streamlit app launched with email:', email);
    });
  }
}