import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/Category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../ConfirmDelete/ConfirmDelete.component';
import { CategoryReadDTO } from '../../models/Category/CategoryReadDTO';
import { SharedService } from '../../services/Shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-Categories',
  templateUrl: './Categories.component.html',
  styleUrls: ['./Categories.component.css'],
  providers: [CategoryService],
  imports: [CommonModule, FormsModule, RouterLink],
})
export class CategoriesComponent implements OnInit {
  categories: CategoryReadDTO[] = [];
  isLoading = true;
  isDeleting = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  searchTerm: string = '';
  private subscription: Subscription = new Subscription();

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  Math: any;

  constructor(private categoryService: CategoryService,
    private modalService: NgbModal,
    private searchService: SharedService
  ) { }

  ngOnInit() {
    this.subscription = this.searchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.loadCategories();
      // Perform search/filter operations here
    })
  }

  loadCategories(): void {
    this.isLoading = true;
    this.error = null;

    this.categoryService.getCategoriesPage(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.totalItems = response.totalCount || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        console.error('Error fetching categories:', err);
      }
    });
  }

  confirmDelete(categoryId: number): void {
    const modalRef = this.modalService.open(ConfirmDeleteComponent);
    modalRef.componentInstance.title = 'Confirm Delete';
    modalRef.componentInstance.message = 'Are you sure you want to delete this category?';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.deleteCategory(categoryId);
      }
    }).catch(() => { });
  }

  deleteCategory(categoryId: number) {
    this.isDeleting = true;
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        // Refresh the category list or remove from local array
        this.categories = this.categories.filter(category => category.id !== categoryId);
        this.isDeleting = false;
        // Optional: Show success message
      },
      error: (err) => {
        console.error('Error deleting category:', err);
        this.isDeleting = false;
        // Show error message to user
      }
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.loadCategories();
  }
  
  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `Showing ${start} - ${end} of ${this.totalItems} categories`;
  }
}
