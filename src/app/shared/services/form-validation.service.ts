import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationsService {

  constructor() { }

  public  ipValidator(control: AbstractControl): { [key: string]: any } | null {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
  
    if (!control.value) {
      return null;
    }
  
    if (ipv4Pattern.test(control.value) || ipv6Pattern.test(control.value)) {
      return null;
    }
  
    return { invalidIp: true };
  }
}
