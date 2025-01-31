// src/app/core/services/switch.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces';
import { SwitchStatus } from '../interfaces/switch-status.interface';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root'
})
export class SwitchService {
  private apiUrl = `${environment.API_URL}/readers/api/v1/actuators`;
  
  constructor(private http: HttpClient) { }

  getAllSwitches(): Observable<SwitchStatus> {
    return this.http.get<ApiResponse<SwitchStatus>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  updateSwitches(switches: SwitchStatus): Observable<any> {
    return this.http.put(`${this.apiUrl}/${switches.id}`, switches);
  }
}
