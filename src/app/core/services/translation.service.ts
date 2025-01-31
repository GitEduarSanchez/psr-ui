import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { TranslationsResponse } from '../interfaces/translations-response.interface';
import { Language } from '../interfaces/language.interface';
import { TranslationsByLanguage } from '../interfaces/translations-by-language.interface';
import { Translations } from '../interfaces/translations.interface';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private apiUrl = `${environment.API_URL}/readers/api/v1/translations`;

  private languagesSubject = new BehaviorSubject<Language[]>([]);
  public languages$ = this.languagesSubject.asObservable();

  private selectedLanguageSubject = new BehaviorSubject<Language | null>(null);
  public selectedLanguage$ = this.selectedLanguageSubject.asObservable();

  private translations: TranslationsByLanguage | null = null;

  constructor(private http: HttpClient) {
    this.loadLanguages();
  }

  private loadLanguages(): void {
    this.http.get<ApiResponse<TranslationsResponse>>(this.apiUrl)
      .pipe(map(response => {
        this.translations = response.data.translations;
        return response.data.languages;
      }))
      .subscribe(languages => {
        this.languagesSubject.next(languages);

        const storedLanguageTag = localStorage.getItem('selectedLanguage');
        if (storedLanguageTag) {
          const storedLanguage = languages.find(lang => lang.tag === storedLanguageTag);
          if (storedLanguage) {
            this.selectedLanguageSubject.next(storedLanguage);
          } else {
            this.selectedLanguageSubject.next(languages[0]);
            localStorage.setItem('selectedLanguage', languages[0].tag);
          }
        } else if (languages.length > 0) {
          this.selectedLanguageSubject.next(languages[0]);
          localStorage.setItem('selectedLanguage', languages[0].tag);
        }
      });
  }

  selectLanguage(language: Language): void {
    this.selectedLanguageSubject.next(language);
    localStorage.setItem('selectedLanguage', language.tag);
  }

  getTranslations(): Translations | null {
    const selectedLanguage = this.selectedLanguageSubject.getValue();

    if (selectedLanguage && this.translations) {
      const tag = selectedLanguage.tag as keyof TranslationsByLanguage;
      return this.translations[tag] || null;
    }

    return null;
  }
}
