import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces';
import { Suggestion } from '../interfaces/suggestion.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageSuggestionService {
  private apiUrl = 'http://192.168.101.5:3000/devices';

  constructor(private http: HttpClient) { }

  getAllSuggestions(): Observable<Suggestion[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => response.data.suggestions)
    );
  }
}
