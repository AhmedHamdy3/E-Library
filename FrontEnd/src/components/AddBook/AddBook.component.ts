import { Component, OnInit } from '@angular/core';
import { CategoryReadDTO } from '../../models/Category/CategoryReadDTO';
import { BookService } from '../../services/Book.service';
import { CategoryService } from '../../services/Category.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-AddBook',
  templateUrl: './AddBook.component.html',
  styleUrls: ['./AddBook.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [BookService, CategoryService],

})
export class AddBookComponent implements OnInit {

  categories: CategoryReadDTO[] = [];
  isLoading = false;
  formError = '';

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
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

      this.bookService.addBook(form.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/books']);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to add book';
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/books']);
  }

}
