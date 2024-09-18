import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';  // Import NgForm
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // For navigating between routes

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

  constructor(private authService: AuthService, private router: Router) {}
  // Handling form submission using NgForm
  // Handling form submission using NgForm
  onSubmit(signInForm: NgForm) {
    if (signInForm.valid) {
      this.authService.signInWithEmail(this.email, this.password)
        .then(user => {
          this.errorMessage = '';  // Clear any previous errors
          this.showIframe = true;  // Show iframe on successful login
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
        this.showIframe = true;  // Show iframe on successful login
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
        this.showIframe = true;  // Show iframe on successful login
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

  // launchStreamlitApp(email: string) {
  //   // Call a backend API to launch Streamlit with the email
  //   this.http.post('/api/launch-streamlit', { email }).subscribe(response => {
  //     console.log('Streamlit app launched with email:', email);
  //   });
  // }
// }
