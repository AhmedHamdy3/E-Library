import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookReadDTO } from '../models/Book/BookReadDTO';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';
import { BookCreateDTO } from '../models/Book/BookCreateDTO';
import { BookUpdateDTO } from '../models/Book/BookUpdateDTO';


@Injectable()
export class BookService {

    constructor(private http: HttpClient) { }

    getBooks(page: number, pageSize: number, searchTerm: string): Observable<{ books: BookReadDTO[], totalCount: number }> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
            .set('filter', searchTerm);

        return this.http.get<BookReadDTO[]>(`${environment.baseUrl}/api/bookPage`, { params, observe: 'response' }).pipe(
            map(response => {
                const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
                return {
                    books: response.body || [],
                    totalCount: totalCount
                };
            })
        );
    }
    getBooksForUser(page: number, pageSize: number, searchTerm: string): Observable<{ books: BookReadDTO[], totalCount: number }> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
            .set('filter', searchTerm);

        return this.http.get<BookReadDTO[]>(`${environment.baseUrl}/api/book/userPage/${localStorage.getItem("userId")}`, { params, observe: 'response' }).pipe(
            map(response => {
                const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
                return {
                    books: response.body || [],
                    totalCount: totalCount
                };
            })
        );
    }

    buyBook(bookId: number): Observable<void> {
        const params = new HttpParams()
            .set('userId', localStorage.getItem("userId")||"")
            .set('bookId', bookId.toString());

        return this.http.get<void>(`${environment.baseUrl}/api/user/buy`, { params }).pipe(
            catchError(error => {
                // Handle specific error statuses
                if (error.status === 404) {
                    throw new Error(error.error || 'Resource not found');
                } else if (error.status === 400) {
                    throw new Error('You already own this book');
                }
                throw new Error('Failed to complete purchase');
            })
        );
    }

    getAllBooksForUser(): Observable<BookReadDTO[]> {
        return this.http.get<BookReadDTO[]>(`${environment.baseUrl}/api/book/user/${localStorage.getItem("userId")}`) || [] as BookReadDTO[];
    }

    getBookById(id: number): Observable<BookReadDTO> {
        return this.http.get<BookReadDTO>(`${environment.baseUrl}/api/book/${id}`).pipe(
            catchError(this.handleError)
        );
    }
    addBook(book: BookCreateDTO): Observable<any> {
        return this.http.post(`${environment.baseUrl}/api/book`, book);
    }

    updateBook(id: number, book: BookUpdateDTO): Observable<any> {
        return this.http.put(`${environment.baseUrl}/api/book/${id}`, book);
    }

    deleteBook(id: number): Observable<any> {
        return this.http.delete(`${environment.baseUrl}/api/book/${id}`);
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (error.status === 404) {
            errorMessage = 'No books found';
        } else if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }
}
