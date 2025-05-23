import { Component, OnInit } from '@angular/core';
import { CategoryReadDTO } from '../../models/Category/CategoryReadDTO';
import { CategoryService } from '../../services/Category.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-AddCategory',
  templateUrl: './AddCategory.component.html',
  styleUrls: ['./AddCategory.component.css'],
    imports: [CommonModule, FormsModule],
    providers: [CategoryService],
})
export class AddCategoryComponent implements OnInit {

  categories: CategoryReadDTO[] = [];
  isLoading = false;
  formError = '';

  constructor(
        private categoryService: CategoryService,
        private router: Router
  ) { }
  

  ngOnInit() {
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.formError = '';

      this.categoryService.addCategory(form.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/category']);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to add category';
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/category']);
  }

}
