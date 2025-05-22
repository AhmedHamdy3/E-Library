import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/User.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserUpdateDTO } from '../../models/User/UserUpdateDTO';

@Component({
  selector: 'app-UpdateUser',
  templateUrl: './UpdateUser.component.html',
  styleUrls: ['./UpdateUser.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [UserService]
})
export class UpdateUserComponent implements OnInit {
  user: UserUpdateDTO = {
    id: "",
    name: '',
    email: '',
    role: '',
  };
  isLoading = false;
  formError = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const userId = this.route.snapshot.params['id'];
    this.loadUser(userId);
  }

  loadUser(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
      error: (err) => {
        this.formError = 'Failed to load user';
        console.error(err);
      }
    });
  }

    onSubmit(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.formError = '';

      this.userService.updateUser(this.user.id, this.user).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to update user';
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/users']);
  }
}
