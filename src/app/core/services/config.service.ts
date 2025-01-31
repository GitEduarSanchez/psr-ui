import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public readonly FRAUD_TYPE = 'Manipulacion';
  public readonly NOTIFICATION_CHANNEL = 'WhatsApp';
  public readonly NOTIFIED_NUMBER = '+57315769057';

  constructor() {}
}
