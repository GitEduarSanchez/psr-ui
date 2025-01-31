import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';
import { ApiResponse } from '../interfaces';
import { User } from '../interfaces/general-data.interface';
import { UserList } from '../interfaces/user-list.interface';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class PsrDataConsumerService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.API_URL}/readers/`;
  public complement = 'pageNumber=1&pageSize=10';

  public getSingleUserData(): Observable<ApiResponse<User>> {
    let id = '1b53f7d5-5b60-434d-bb7a-7f9f9e5e2b65';
    return this.http.get<ApiResponse<User>>(this.apiUrl + id + '?' + this.complement)
      .pipe(tap(response => {
        localStorage.setItem('userData', JSON.stringify(response.data));
      }));
  }

  public getAllUsersData(): Observable<ApiResponse<UserList>> {
    return this.http.get<ApiResponse<UserList>>(this.apiUrl + '?' + this.complement);
  }
}
