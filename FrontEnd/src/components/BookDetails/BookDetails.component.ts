import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BookService } from '../../services/Book.service';
import { CategoryReadDTO } from '../../models/Category/CategoryReadDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { BookUpdateDTO } from '../../models/Book/BookUpdateDTO';

@Component({
  selector: 'app-BookDetails',
  templateUrl: './BookDetails.component.html',
  styleUrls: ['./BookDetails.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [BookService]
})
export class BookDetailsComponent implements OnInit {
  book: BookUpdateDTO = {
    id: 0,
    title: '',
    description: '',
    author: '',
    price: 0,
    categoryId: 0
  };
  category = ""
  categories: CategoryReadDTO[] = [];
  isLoading = false;
  formError = '';
  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const bookId = this.route.snapshot.params['id'];
    this.loadBook(bookId);
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
          categoryId: 0
        };
        this.category = book.category
      },
      error: (err) => {
        this.formError = 'Failed to load book';
        console.error(err);
      }
    });
  }


  goBack() {
    this.router.navigate(['/user/booksList']);
  }
}
