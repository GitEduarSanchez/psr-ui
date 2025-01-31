import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private pdfUploadUrl = 'http://159.89.239.32:5005/api/openai/pdf';
  private promptUrl = 'https://poliedroapigateway.azure-api.net/query';

  constructor(private http: HttpClient) {}

  uploadPDF(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', file);
    return this.http.post(this.pdfUploadUrl, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text',
    });
  }

  askQuestion(question: string): Observable<any> {
    const body = { texto: question };
    return this.http.post<any>(this.promptUrl, body);
  }
}
