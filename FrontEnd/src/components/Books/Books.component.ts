import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../../services/Book.service';
import { BookReadDTO } from '../../models/Book/BookReadDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../ConfirmDelete/ConfirmDelete.component';
import { SharedService } from '../../services/Shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-Books',
  templateUrl: './Books.component.html',
  styleUrls: ['./Books.component.css'],
  providers: [BookService],
  imports: [CommonModule, FormsModule, RouterLink],
})
export class BooksComponent implements OnInit, OnDestroy {
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

  displayedColumns: string[] = ['id', 'title', 'author', 'price', 'category', 'actions'];

  constructor(private bookService: BookService,
    private modalService: NgbModal,
    private searchService: SharedService
  ) { }

  ngOnInit(): void {
    this.subscription = this.searchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.loadBooks();
    });

  }

  loadBooks(): void {
    this.isLoading = true;
    this.error = null;

    this.bookService.getBooks(this.currentPage, this.pageSize, this.searchTerm).subscribe({
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

  confirmDelete(bookId: number): void {
    const modalRef = this.modalService.open(ConfirmDeleteComponent);
    modalRef.componentInstance.title = 'Confirm Delete';
    modalRef.componentInstance.message = 'Are you sure you want to delete this book?';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.deleteBook(bookId);
      }
    }).catch(() => { });
  }

  deleteBook(bookId: number) {
    this.isDeleting = true;
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        // Refresh the book list or remove from local array
        this.books = this.books.filter(book => book.id !== bookId);
        this.isDeleting = false;
        // Optional: Show success message
      },
      error: (err) => {
        console.error('Error deleting book:', err);
        this.isDeleting = false;
        // Show error message to user
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
}
