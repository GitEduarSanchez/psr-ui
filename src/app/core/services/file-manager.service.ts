import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@envs/environment';
import { SyncFolderRequest } from '@core/interfaces/sync-folder-request.interface';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  private apiUrl = `${environment.API_URL_IA}`;

  constructor(private http: HttpClient) {}

  // Folders methods
  public getAllFolders(userId: string): Observable<any> {
    return this.http.post(this.apiUrl + '/folders/list', {user_id: userId});
  }

  public createFolder(payload: { user_id: string; folder_name: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/folders/create', payload);
  }

  public deleteFolder(folderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/folders/delete/${folderId}`);
  }

  public syncGoogleDriveFolders(body: SyncFolderRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/google-drive/folders/sync/`, body);
  } 

  // Files methods
  public getFilesByFolderId(folderId: string): Observable<any> {
    return this.http.post(this.apiUrl + '/files/list-by-folder', {folder_id: folderId});
  }

  public uploadFiles(folderId: string, userId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));

    const params = new HttpParams()
    .set('folder_id', folderId)
    .set('user_id', userId);

    return this.http.post(`${this.apiUrl}/folders/upload-files/`, formData, { params }).pipe(
      catchError(this.handleError)
    );
  }

  public deleteFiles(folderId: string, fileIds: string[] ): Observable<any> {
    const data = { folder_id: folderId, file_ids: fileIds };
    return this.http.delete(`${this.apiUrl}/files/delete/`, { body: data });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);

    let userFriendlyMessage = 'An unexpected error occurred.';
    if (error.status === 400) {
      userFriendlyMessage = 'Invalid input. Please check your files or namespace.';
    } else if (error.status === 500) {
      userFriendlyMessage = 'Server error. Please try again later.';
    }

    return throwError(() => new Error(userFriendlyMessage));
  }
}
