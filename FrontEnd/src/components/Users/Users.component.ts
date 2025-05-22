import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/User.service';
import { UserReadDTO } from '../../models/User/UserReadDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../ConfirmDelete/ConfirmDelete.component';
import { SharedService } from '../../services/Shared.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-Users',
  templateUrl: './Users.component.html',
  styleUrls: ['./Users.component.css'],
  providers: [UserService],
  imports: [CommonModule, FormsModule, RouterLink],
})
export class UsersComponent implements OnInit {
  users: UserReadDTO[] = [];
  isLoading = true;
  isDeleting = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
    searchTerm: string = '';
  private subscription: Subscription = new Subscription();

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];

  constructor(
    private userService: UserService,
        private modalService: NgbModal,
            private searchService: SharedService
  ) { }

  ngOnInit() {
    this.subscription = this.searchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.loadUsers();
    });
  }

    loadUsers(): void {
    this.isLoading = true;
    this.error = null;

    this.userService.getUsers(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalItems = response.totalCount || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        console.error('Error fetching users:', err);
      }
    });
  }

  confirmDelete(userId: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteComponent);
    modalRef.componentInstance.title = 'Confirm Delete';
    modalRef.componentInstance.message = 'Are you sure you want to delete this user?';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.deleteUser(userId);
      }
    }).catch(() => { });
  }

    deleteUser(userId: string) {
    this.isDeleting = true;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        // Refresh the user list or remove from local array
        this.users = this.users.filter(user => user.id !== userId);
        this.isDeleting = false;
        // Optional: Show success message
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.isDeleting = false;
        // Show error message to user
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.loadUsers();
  }

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `Showing ${start} - ${end} of ${this.totalItems} users`;
  }

}
