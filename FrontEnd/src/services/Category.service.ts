import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryReadDTO } from '../models/Category/CategoryReadDTO';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';
import { CategoryCreateDTO } from '../models/Category/CategoryCreateDTO';
import { CategoryUpdateDTO } from '../models/Category/CategoryUpdateDTO';
import { AuthService } from './Auth.service';

@Injectable()
export class CategoryService {

    constructor(private http: HttpClient, private authService: AuthService) { }
    getCategories(): Observable<CategoryReadDTO[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
        return this.http.get<CategoryReadDTO[]>(`${environment.baseUrl}/api/category`, { headers });
    }

    getCategoriesPage(page: number, pageSize: number, searchTerm: string): Observable<{ categories: CategoryReadDTO[], totalCount: number }> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
            .set('filter', searchTerm);

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
        return this.http.get<CategoryReadDTO[]>(`${environment.baseUrl}/api/categoryPage`, { params, headers, observe: 'response' }).pipe(
            map(response => {
                const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
                return {
                    categories: response.body || [],
                    totalCount: totalCount
                };
            })
        );
    }

    getCategoryById(id: number): Observable<CategoryReadDTO> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
        return this.http.get<CategoryReadDTO>(`${environment.baseUrl}/api/category/${id}`, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    addCategory(category: CategoryCreateDTO): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
        return this.http.post(`${environment.baseUrl}/api/category`, category, { headers });
    }

    updateCategory(id: number, category: CategoryUpdateDTO): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
        return this.http.put(`${environment.baseUrl}/api/category/${id}`, category, { headers });
    }

    deleteCategory(id: number): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
        return this.http.delete(`${environment.baseUrl}/api/category/${id}`, { headers });
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (error.status === 404) {
            errorMessage = 'No Categories found';
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
