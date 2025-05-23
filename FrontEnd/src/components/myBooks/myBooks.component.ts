import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../../services/Book.service';
import { BookReadDTO } from '../../models/Book/BookReadDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-myBooks',
  templateUrl: './myBooks.component.html',
  styleUrls: ['./myBooks.component.css'],
  providers: [BookService],
  imports: [CommonModule, FormsModule],
})
export class MyBooksComponent implements OnInit {
  books: BookReadDTO[] = [];
  isLoading = true;
  isDeleting = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  searchTerm: string = '';
  private subscription: Subscription = new Subscription();

  displayedColumns: string[] = ['title', 'author', 'price', 'category', 'actions'];

  constructor(
    private bookService: BookService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.error = null;
    this.bookService.getBooksForUser(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.books = response.books;
        this.totalItems = response.totalCount || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        console.error('Error fetching books:', err);
      }
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadBooks();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.loadBooks();
  }

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `Showing ${start} - ${end} of ${this.totalItems} books`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch($event: Event) {
    this.loadBooks();
  }
}
