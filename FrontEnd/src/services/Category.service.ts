import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryReadDTO } from '../models/Category/CategoryReadDTO';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';
import { CategoryCreateDTO } from '../models/Category/CategoryCreateDTO';
import { CategoryUpdateDTO } from '../models/Category/CategoryUpdateDTO';

@Injectable()
export class CategoryService {

    constructor(private http: HttpClient) { }
    getCategories(): Observable<CategoryReadDTO[]> {
        return this.http.get<CategoryReadDTO[]>(`${environment.baseUrl}/api/category`);
    }

    getCategoriesPage(page: number, pageSize: number, searchTerm: string): Observable<{ categories: CategoryReadDTO[], totalCount: number }> {
        const params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
        .set('filter',searchTerm);
        return this.http.get<CategoryReadDTO[]>(`${environment.baseUrl}/api/categoryPage`, { params, observe: 'response' }).pipe(
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
        return this.http.get<CategoryReadDTO>(`${environment.baseUrl}/api/category/${id}`).pipe(
            catchError(this.handleError)
        );
    }
    addCategory(category: CategoryCreateDTO): Observable<any> {
        return this.http.post(`${environment.baseUrl}/api/category`, category);
    }

    updateCategory(id: number, category: CategoryUpdateDTO): Observable<any> {
        return this.http.put(`${environment.baseUrl}/api/category/${id}`, category);
    }

    deleteCategory(id:number):Observable<any>{
        return this.http.delete(`${environment.baseUrl}/api/category/${id}`);
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
