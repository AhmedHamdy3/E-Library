import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [AuthService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  onLogin(): void {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('Login successful');
        if(localStorage.getItem("roles")=="Admin"){
          this.router.navigate(['/admin']); 
        }
        else if(localStorage.getItem("roles") == "User"){
          this.router.navigate(['/user']); 
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
        console.error('Login failed', err);
      }
    });
  }
  navigateToRegister() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/register']);
    });
  }
}

