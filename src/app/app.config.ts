import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {HttpClientModule} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator'
import {CustomPaginatorIntlService} from "./core/services/custom-paginator-intl.service";
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, MatPaginatorModule), provideAnimationsAsync(),
    CustomPaginatorIntlService,
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntlService },
    provideStore()
]
};
