import { Component, OnInit } from '@angular/core';
import { CategoryReadDTO } from '../../models/Category/CategoryReadDTO';
import { UserService } from '../../services/User.service';
import { CategoryService } from '../../services/Category.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-AddUser',
  templateUrl: './AddUser.component.html',
  styleUrls: ['./AddUser.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [UserService],
})
export class AddUserComponent implements OnInit {
  showPassword = false;
  showConfirmPassword = false;  
  isLoading = false;
  formError = '';
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.formError = '';

      this.userService.addUser(form.value).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to add user';
          this.isLoading = false;
        }
      });
    }
  }
  goBack() {
    this.router.navigate(['/users']);
  }
}
