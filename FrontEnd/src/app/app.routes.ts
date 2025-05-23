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
import { LoginComponent } from '../components/Login/Login.component';
import { RegisterComponent } from '../components/Register/Register.component';
import { AdminLayoutComponent } from '../components/AdminLayout/AdminLayout.component';
import { Component } from '@angular/core';
import { UserLayoutComponent } from '../components/UserLayout/UserLayout.component';
import { GuesLayoutComponent } from '../components/GuesLayout/GuesLayout.component';
import { AccessDeniedComponent } from '../components/AccessDenied/AccessDenied.component';
import { adminGuard } from '../gaurds/admin.guard';
import { userGuard } from '../gaurds/user.guard';
import { guestGuard } from '../gaurds/guest.guard';
import { NotFoundComponent } from '../components/NotFound/NotFound.component';

export const routes: Routes = [
    { path: 'access-denied', component: AccessDeniedComponent },
    {
        path: "",
        component: GuesLayoutComponent,
        canActivate: [guestGuard],
        children: [
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: 'booksList', component: BooksListComponent },
            { path: 'home', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'books', component: BooksComponent },
            { path: 'addBook', component: AddBookComponent },
            { path: 'addCategory', component: AddCategoryComponent },
            { path: 'addUser', component: AddUserComponent },
            { path: 'updateBook/:id', component: UpdateBookComponent },
            { path: 'updateCategory/:id', component: UpdateCategoryComponent },
            { path: 'updateUser/:id', component: UpdateUserComponent },
            { path: 'category', component: CategoriesComponent },
            { path: '', redirectTo: 'books', pathMatch: 'full' }
        ],
    },
    {
        path: 'user',
        component: UserLayoutComponent,
        canActivate: [userGuard],
        children: [
            { path: 'booksList', component: BooksListComponent },
            { path: 'home', component: HomeComponent },
            { path: 'myBooks', component: MyBooksComponent },
            { path: 'bookDetails/:id', component: BookDetailsComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: '**', component: NotFoundComponent },



    // { path: '', redirectTo: '/admin/users', pathMatch: 'full' }
    // { path: 'admin/users', component: UsersComponent },
    // { path: 'admin/books', component: BooksComponent },
    // { path: 'admin/addBook', component: AddBookComponent },
    // { path: 'admin/addCategory', component: AddCategoryComponent },
    // { path: 'admin/addUser', component: AddUserComponent },
    // { path: 'admin/updateBook/:id', component: UpdateBookComponent },
    // { path: 'admin/updateCategory/:id', component: UpdateCategoryComponent },
    // { path: 'admin/updateUser/:id', component: UpdateUserComponent },
    // { path: 'admin/category', component: CategoriesComponent },
    // {path: 'booksList', component: BooksListComponent},
    // {path: 'home', component: HomeComponent},
    // {path: 'myBooks', component: MyBooksComponent},
    // {path: 'bookDetails/:id', component: BookDetailsComponent},
];
