import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {ConfigService} from './config.service';

@Injectable({
    providedIn: 'root'
})
export class WhatsappService {
    private apiUrl = `http://159.89.239.32:5005/api/v1/whatsapp/send?number=${encodeURIComponent(this.configService.NOTIFIED_NUMBER)}`;

    constructor(private http: HttpClient, private configService: ConfigService) {
    }

    sendMessage(message: string): Observable<any> {
        if (message.length > 1600) {
            return of({error: 'Message is too long'});
        }

        const fullApiUrl = this.apiUrl;

        return this.http.post(fullApiUrl, JSON.stringify(message), {
            headers: {'Content-Type': 'application/json'}
        }).pipe(
            catchError((error) => {
                console.error('Error in sendMessage:', error);
                return of({error: 'Failed to send message'});
            })
        );
    }
}
