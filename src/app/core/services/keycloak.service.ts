import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/auth`;
  constructor(private keycloakService: KeycloakService) {}

  async init() {
    await this.keycloakService.init({
      config: {
        url: this.apiUrl,
        realm: 'your-realm-name',
        clientId: 'angular-app'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: true
      }
    });
  }

  logout() {
    return this.keycloakService.logout();
  }

  isLoggedIn() {
    return this.keycloakService.isLoggedIn();
  }

  getUsername() {
    return this.keycloakService.getUsername();
  }
}
