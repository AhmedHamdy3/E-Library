import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth.service';
import { Router } from '@angular/router';
import { UserCreateDTO } from '../../models/User/UserCreateDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/User.service';
@Component({
  selector: 'app-Register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css'],
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [AuthService, Router, UserService]
})
export class RegisterComponent implements OnInit {

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading = false;
  formError = '';

  errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.formError = '';

      this.userService.addUser(form.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to Register';
          this.isLoading = false;
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showPassword;
  }
  navigateToLogin(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/register']);
    });
  }
}
