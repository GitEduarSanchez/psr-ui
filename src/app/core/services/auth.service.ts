import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces';
import { Login } from '../interfaces/login.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/authentication`;

  constructor(private http: HttpClient) {}

  verifyPhone(phone: string): Observable<ApiResponse> {
    const data = {
        codeCountry: '+57',
        phone: phone,
    }
    return this.http.post<ApiResponse>(`${this.apiUrl + 'verifyphone'}` , data);
  }

  login(data: Login): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl + 'login'}`, data);
  }
}
