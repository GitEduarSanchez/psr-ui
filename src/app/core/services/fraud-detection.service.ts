import {Injectable} from '@angular/core';
import {WhatsappService} from './whatsapp.service';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root',
})
export class FraudDetectionService {
  constructor(private whatsappService: WhatsappService, private configService: ConfigService) {
  }

  detectManipulation(): void {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      this.sendFraudAlert(userData);
    } else {
      console.warn('No user data found in localStorage');
    }
  }

  private sendFraudAlert(userData: any): void {
    const firstAddress = userData.user.address[0];
    const addressString = `${firstAddress.kdx}, ${firstAddress.neighborhood}, ${firstAddress.zone}, ${firstAddress.city}, ${firstAddress.country}`;

    const message = `Fraud alert detected:\nName: ${userData.user.person.name},\nAddress: ${addressString}\nLatitude: ${firstAddress.gps.latitude}\nLongitude: ${firstAddress.gps.longitude}\nDate and Time: ${new Date().toISOString()}\nFraud Type: ${this.configService.FRAUD_TYPE}\nNotification Channel: ${this.configService.NOTIFICATION_CHANNEL}\nNotified Number: ${this.configService.NOTIFIED_NUMBER}`;

    this.whatsappService.sendMessage(message).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error('Error sending the message:', error.message);
      }
    });
  }
}
