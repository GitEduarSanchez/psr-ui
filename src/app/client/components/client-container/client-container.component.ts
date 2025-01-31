import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { DashboardComponent } from '../../../shared/components/dashboard/dashboard.component';
import { PsrDataConsumerService } from '../../../core/services/psr-data-consumer.service';
import { ApiResponse, IUserInformation } from '../../../core/interfaces';
import { User } from '../../../core/interfaces/general-data.interface';
import { StorageService } from '../../../core/services/storage.service';
import { UserRole } from '../../../core/enums/user-role.enum';


@Component({
  selector: 'app-client-container',
  standalone: true,
  imports: [
    NavbarComponent,
    DashboardComponent
  ],
  templateUrl: './client-container.component.html',
  styleUrl: './client-container.component.scss'
})
export class ClientContainerComponent {

  public apiResponseData!: ApiResponse<User>;
  public dashboardConfig!: IUserInformation;

  constructor(
    private psrDataConsumerService: PsrDataConsumerService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.getApiData();
    this.saveUserTypeInSession();
  }

  private getApiData(): void {
    this.psrDataConsumerService.getSingleUserData().subscribe(
      (res) => {
        if (res.status === 'OK') {
          this.apiResponseData = res;
          this.buildDashboardConfig();
        }
      },
      (error) => {
        console.error('API Error', error);
      }
    )
  }

  private buildDashboardConfig() {
    this.dashboardConfig = this.apiResponseData.data.user
  }

   //TODO: Remove when Ngrx be implemented
  private saveUserTypeInSession() {
    this.storageService.setSessionStorage('role', UserRole.Client)
  }
}
