import { TranslationsByLanguage } from './translations-by-language.interface';
import { Language } from './language.interface';

export interface TranslationsResponse {
  translations: TranslationsByLanguage;
  languages: Language[];
}
