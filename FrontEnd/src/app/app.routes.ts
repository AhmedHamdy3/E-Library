import { Routes } from '@angular/router';
import { UsersComponent } from '../components/Users/Users.component';
import { BooksComponent } from '../components/Books/Books.component';
import { CategoriesComponent } from '../components/Categories/Categories.component';
import { AddBookComponent } from '../components/AddBook/AddBook.component';
import { UpdateBookComponent } from '../components/UpdateBook/UpdateBook.component';
import { UpdateCategoryComponent } from '../components/UpdateCategory/UpdateCategory.component';
import { AddCategoryComponent } from '../components/AddCategory/AddCategory.component';
import { AddUserComponent } from '../components/AddUser/AddUser.component';
import { UpdateUserComponent } from '../components/UpdateUser/UpdateUser.component';

export const routes: Routes = [
    { path: 'users', component: UsersComponent },
    { path: 'books', component: BooksComponent },
    { path: 'addBook', component: AddBookComponent },
    { path: 'addCategory', component: AddCategoryComponent },
    { path: 'addUser', component: AddUserComponent },
    { path: 'updateBook/:id', component: UpdateBookComponent },
    { path: 'updateCategory/:id', component: UpdateCategoryComponent },
    { path: 'updateUser/:id', component: UpdateUserComponent },
    { path: 'category', component: CategoriesComponent },
    { path: '', redirectTo: '/users', pathMatch: 'full' }, // default route
];
