import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gapi } from 'gapi-script';
import { catchError, Observable, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  private clientId: string = '433165121309-40es317lses8phor3tqae8h9i6crf2ej.apps.googleusercontent.com';
  private apiUrl = `${environment.API_URL_IA}`;
  private accessToken: string | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.initGoogleAPI();
  }

   /**
   * Initializes the Google API client.
   */
   private initGoogleAPI(): void {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/drive',
      });
    });
  }

  /**
   * Sign in to Google and fetch the access token.
   */
  public signIn(): Promise<boolean> {
    const auth2 = gapi.auth2.getAuthInstance();

    return auth2.signIn()
      .then((googleUser: any) => {
        this.accessToken = googleUser.getAuthResponse().access_token;
        this.storageService.setLocalStorage('googleAuthToken', this.accessToken);
        return true
      })
      .catch((error: any) => {
        console.error('Authentication error', error);
        return false;
      });
  }

  public signOut(): void {
    const auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(() => {
      this.accessToken = null;
      console.log('User signed out');
    });
  }

  public getGoogleDriveFolders(): Observable<any> {
    if (!this.accessToken) {
      return throwError(() => new Error('User not authenticated'));
    }

    const payload = { access_token: this.accessToken };

    return this.http.post<any>(this.apiUrl + '/google-drive/folders/', payload).pipe(
      catchError((error) => {
        console.error('Error fetching Google Drive folders', error);
        return throwError(() => error);
      })
    );
  }

  public getFolderById(id: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'mongo-files-by-folder', id);
  }
}
