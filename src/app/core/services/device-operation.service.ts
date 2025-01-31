import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces';
import { DeviceStatus } from '../interfaces/device-operation.interface';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceOperationService {
  
  private apiUrl = `${environment.API_URL}/readers/api/operations?pageNumber=1&pageSize=10`;

  constructor(private http: HttpClient) { }

  getAllSwitches(): Observable<DeviceStatus> {
    return this.http.get<ApiResponse<DeviceStatus>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}
