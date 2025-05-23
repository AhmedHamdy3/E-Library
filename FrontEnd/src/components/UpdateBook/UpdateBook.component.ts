import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BookService } from '../../services/Book.service';
import { CategoryService } from '../../services/Category.service';
import { CategoryReadDTO } from '../../models/Category/CategoryReadDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { BookUpdateDTO } from '../../models/Book/BookUpdateDTO';

@Component({
  selector: 'app-UpdateBook',
  templateUrl: './UpdateBook.component.html',
  styleUrls: ['./UpdateBook.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [BookService, CategoryService]
})
export class UpdateBookComponent implements OnInit {
  book: BookUpdateDTO = {
    id: 0,
    title: '',
    description: '',
    author: '',
    price: 0,
    categoryId: 0
  };
  categories: CategoryReadDTO[] = [];
  isLoading = false;
  formError = '';

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const bookId = this.route.snapshot.params['id'];
    this.loadCategoriesThenBook(bookId);
  }

  loadBook(id: number) {
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = {
          id: book.id,
          title: book.title,
          description: book.description,
          author: book.author,
          price: book.price,
          categoryId: this.categories.find(c => c.name == book.category)?.id || 0
        };
      },
      error: (err) => {
        this.formError = 'Failed to load book';
        console.error(err);
      }
    });
  }
  loadCategoriesThenBook(bookId: number) {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadBook(bookId); // call after categories are ready
      },
      error: (err) => {
        this.formError = 'Failed to load categories';
        console.error(err);
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.formError = '';

      this.bookService.updateBook(this.book.id, this.book).subscribe({
        next: () => {
          this.router.navigate(['/admin/books']);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to update book';
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/books']);
  }
}
