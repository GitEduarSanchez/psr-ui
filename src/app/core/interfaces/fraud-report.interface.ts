export interface FraudReport {
  id: number;
  address: string;
  latitude: string;
  longitude: string;
  firstSeen: string;
  fraudType: string;
  notificationChannel: string;
  notifiedNumber: string;
  name: string;
}
