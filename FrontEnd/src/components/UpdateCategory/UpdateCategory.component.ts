import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoryService } from '../../services/Category.service';
import { CategoryReadDTO } from '../../models/Category/CategoryReadDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryUpdateDTO } from '../../models/Category/CategoryUpdateDTO';

@Component({
  selector: 'app-UpdateCategory',
  templateUrl: './UpdateCategory.component.html',
  styleUrls: ['./UpdateCategory.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [CategoryService]
})
export class UpdateCategoryComponent implements OnInit {
  category: CategoryUpdateDTO = {
    id: 0,
    name: '',
    description: '',
  };
  isLoading = false;
  formError = '';
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const categoryId = this.route.snapshot.params['id'];
    this.loadCategory(categoryId);
  }

  loadCategory(id: number) {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.category = {
          id: category.id,
          name: category.name,
          description: category.description,
        };
      },
      error: (err) => {
        this.formError = 'Failed to load category';
        console.error(err);
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.formError = '';

      this.categoryService.updateCategory(this.category.id, this.category).subscribe({
        next: () => {
          this.router.navigate(['/category']);
        },
        error: (err) => {
          this.formError = err.message || 'Failed to update category';
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/category']);
  }
}
