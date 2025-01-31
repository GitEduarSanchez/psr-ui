import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {TranslationService} from '../../../core/services/translation.service';
import {AgentComponent} from '../../../agent/agent/agent.component';
import {DeviceListComponent} from '../../components/device-list/device-list.component';
import {FraudReportListComponent} from '../../components/fraud-report-list/fraud-report-list.component';
import {DeviceStatus} from '../../../core/interfaces/device-operation.interface';
import {NavbarComponent} from '../../../shared/components/navbar/navbar.component';
import {DeviceOperationService} from "../../../core/services/device-operation.service";
import {FraudReportService} from '../../../core/services/fraud-report.service';
import {FraudReport} from "../../../core/interfaces/fraud-report.interface";
import { LocationComponent } from "../location/location.component";
import { StorageService } from '../../../core/services/storage.service';
import { UserRole } from '../../../core/enums/user-role.enum';

@Component({
  selector: 'app-operations-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AgentComponent,
    DeviceListComponent,
    FraudReportListComponent,
    NavbarComponent,
    LocationComponent
],
  templateUrl: './operations-dashboard.component.html',
  styleUrls: ['./operations-dashboard.component.scss']
})
export class OperationsDashboardComponent implements OnInit {
  public translations: any;
  public selectedMenu: string = 'devices';
  public devices: DeviceStatus[] = [];
  public fraudReports: FraudReport[] = [];

  constructor(
    private translationService: TranslationService,
    private deviceOperationService: DeviceOperationService,
    private fraudReportService: FraudReportService,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    this.saveUserTypeInSession();
    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });
    this.fetchDevices();
    this.fetchFraudReports();
  }

  fetchDevices(): void {
    this.deviceOperationService.getAllSwitches().subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.devices = response;
        } else {
          console.warn('No devices found or incorrect response format.');
        }
      },
      error: (error) => {
        console.error('Error fetching devices:', error);
      }
    });
  }

  fetchFraudReports(): void {
    this.fraudReportService.getAllSwitches().subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.fraudReports = response;
        } else {
          console.warn('No devices found or incorrect response format.');
        }
      },
      error: (error) => {
        console.error('Error fetching devices:', error);
      }
    });
  }

  selectMenu(menu: string): void {
    this.selectedMenu = menu;
  }

   //TODO: Remove when Ngrx be implemented
  private saveUserTypeInSession() {
    this.storageService.setSessionStorage('role', UserRole.Operator)
  }
}
