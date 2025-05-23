import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { UserCreateDTO } from '../models/User/UserCreateDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/Account/Login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('roles', response.roles[0]);
        localStorage.setItem("userId", response.id)
      })
    );
  }

  register(user: UserCreateDTO): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/Account/Register`, user);
  }


  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    if (localStorage.getItem("roles") == 'Admin') return true
    else return false
  }

  isUser(): boolean {
    if (localStorage.getItem("roles") == 'User') return true
    else return false
  }
}
