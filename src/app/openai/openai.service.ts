import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '@envs/environment';

interface OpenAIResponse {
  id: string;
  object: string;
  data: { response:  string };
}

@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  private apiUrl = `${environment.API_URL_IA}/openai/query-folder-content
`;
  private cancelRequestSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  generatePrompt(prompt: string, id: string): Observable<OpenAIResponse> {
    const request = { question: prompt, folder_id: id };
    return this.http.post<OpenAIResponse>(this.apiUrl, request)
    .pipe(takeUntil(this.cancelRequestSubject));
  }

  ngOnDestroy() {
    this.cancelRequestSubject.next();
    this.cancelRequestSubject.complete();
  }
}
