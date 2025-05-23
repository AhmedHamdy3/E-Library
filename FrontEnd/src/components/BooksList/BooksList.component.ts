import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BookService } from '../../services/Book.service';
import { BookReadDTO } from '../../models/Book/BookReadDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/Auth.service';
import { right } from '@popperjs/core';
@Component({
  selector: 'app-BooksList',
  templateUrl: './BooksList.component.html',
  styleUrls: ['./BooksList.component.css'],
  providers: [BookService],
  imports: [CommonModule, FormsModule],
})
export class BooksListComponent implements OnInit {

  @ViewChild('purchaseModal') purchaseModal!: TemplateRef<any>; // Add this line

  selectedBook: BookReadDTO = {} as BookReadDTO;
  purchasedBooks: BookReadDTO[] = [];

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
  private activeModalRef: NgbModalRef | null = null; // Track active modal reference

  displayedColumns: string[] = ['title', 'author', 'price', 'category', 'actions'];

  constructor(
    private bookService: BookService,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBooks();
    if(this.authService.isLoggedIn()){
      this.loadPurchasedBooks();
    }
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


  openPurchaseModal(book: BookReadDTO) {
    console.log(this.authService.isLoggedIn)
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/login")
      return;
    }
    this.selectedBook = book;


    // Check if already purchased
    if (this.purchasedBooks?.some(b => b.id === book.id)) {
      this.showAlreadyPurchasedAlert();
      return;
    }

    // Open the modal using the ViewChild reference
    this.activeModalRef = this.modalService.open(this.purchaseModal, {
      ariaLabelledBy: 'purchase-modal-title'
    });

    // Handle modal result
    this.activeModalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.confirmPurchase();
        }
      },
      (reason) => {
        console.log(`Dismissed with reason: ${reason}`);
      }
    );
  }
  confirmPurchase() {
    this.bookService.buyBook(this.selectedBook.id).subscribe({
      next: () => {
        this.activeModalRef?.close();
        this.router.navigateByUrl('/user/myBooks')
      },
      error: (err) => {
        this.activeModalRef?.close();
        console.error("Error While Buying")
      }
    });
    if (!this.selectedBook) {
      this.activeModalRef?.close();
      return;
    }
  }

  // Method to confirm purchase

  // Method to show already purchased alert
  showAlreadyPurchasedAlert() {
    const alert = document.createElement('div');
    alert.className = 'alert alert-warning alert-dismissible fade show text-center';
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = '1100';
    alert.style.minWidth = '300px';
    alert.style.maxWidth = '80%';
    alert.innerHTML = `
    <strong>Already Purchased!</strong> You've already bought this book.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

    document.body.appendChild(alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 150);
    }, 5000);

    // Manual dismiss
    alert.querySelector('.btn-close')?.addEventListener('click', () => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 150);
    });
  }

  loadPurchasedBooks() {
    this.isLoading = true;
    this.error = null;
    this.bookService.getAllBooksForUser().subscribe({
      next: (data) => {
        this.purchasedBooks = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        console.error('Error fetching purchased books:', err);
      }
    });
  }

  goToDetails(bookId: number) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/login")
      return;
    }
    this.router.navigate(['/user/bookDetails', bookId])
  }
}
