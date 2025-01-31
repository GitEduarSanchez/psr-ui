import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // Save data in sessionStorage
  setSessionStorage(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  // Retrieve data from sessionStorage
  getSessionStorage(key: string): any {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Remove data from sessionStorage
  removeSessionStorage(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Save data in localStorage
  setLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Retrieve data from localStorage
  getLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Remove data from localStorage
  removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
