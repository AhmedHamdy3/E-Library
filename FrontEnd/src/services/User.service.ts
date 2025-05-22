import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCreateDTO } from '../models/User/UserCreateDTO';
import { UserReadDTO } from '../models/User/UserReadDTO';
import { UserUpdateDTO } from '../models/User/UserUpdateDTO';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private http: HttpClient) { }


    getUsers(page: number, pageSize: number, searchTerm: string): Observable<{ users: UserReadDTO[], totalCount: number }> {
        const params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
        .set('filter',searchTerm);

        return this.http.get<UserReadDTO[]>(`${environment.baseUrl}/api/userPage`, { params, observe: 'response' }).pipe(
            map(response => {
                const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
                return {
                    users: response.body || [],
                    totalCount: totalCount
                };
            })
        );
    }


        getUserById(id: string): Observable<UserReadDTO> {
            return this.http.get<UserReadDTO>(`${environment.baseUrl}/api/user/${id}`).pipe(
                catchError(this.handleError)
            );
        }
        addUser(user: UserCreateDTO): Observable<any> {
            return this.http.post(`${environment.baseUrl}/api/user`, user);
        }
    
        updateUser(id: string, user: UserUpdateDTO): Observable<any> {
            return this.http.put(`${environment.baseUrl}/api/user/${id}`, user);
        }
    
        deleteUser(id:string):Observable<any>{
            return this.http.delete(`${environment.baseUrl}/api/user/${id}`);
        }
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (error.status === 404) {
            errorMessage = 'No users found';
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
