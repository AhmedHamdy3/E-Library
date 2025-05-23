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
import { BooksListComponent } from '../components/BooksList/BooksList.component';
import { BookDetailsComponent } from '../components/BookDetails/BookDetails.component';
import { HomeComponent } from '../components/Home/Home.component';
import { MyBooksComponent } from '../components/myBooks/myBooks.component';

export const routes: Routes = [
    { path: 'admin/users', component: UsersComponent },
    { path: 'admin/books', component: BooksComponent },
    { path: 'admin/addBook', component: AddBookComponent },
    { path: 'admin/addCategory', component: AddCategoryComponent },
    { path: 'admin/addUser', component: AddUserComponent },
    { path: 'admin/updateBook/:id', component: UpdateBookComponent },
    { path: 'admin/updateCategory/:id', component: UpdateCategoryComponent },
    { path: 'admin/updateUser/:id', component: UpdateUserComponent },
    { path: 'admin/category', component: CategoriesComponent },
    {path: 'booksList', component: BooksListComponent},
    {path: 'home', component: HomeComponent},
    {path: 'myBooks', component: MyBooksComponent},
    {path: 'bookDetails/:id', component: BookDetailsComponent},
    { path: '', redirectTo: '/admin/books', pathMatch: 'full' }, // default route
];
