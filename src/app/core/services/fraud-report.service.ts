import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../interfaces";
import {map} from "rxjs/operators";
import {FraudReport} from '../interfaces/fraud-report.interface';

@Injectable({
  providedIn: 'root'
})
export class FraudReportService {

  private apiUrl = 'http://192.168.101.75:3000/api/manipulaciones';

  constructor(private http: HttpClient) {
  }

  getAllSwitches(): Observable<FraudReport> {
    return this.http.get<ApiResponse<FraudReport>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}
