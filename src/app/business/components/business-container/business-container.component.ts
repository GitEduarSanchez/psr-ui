import {Component} from '@angular/core';
import {Address, ApiResponse, IUserInformation} from '../../../core/interfaces';
import {UserList} from '../../../core/interfaces/user-list.interface';
import {FilterPipeSearchCriteria} from '../../../shared/interfaces/filter-pipe-search-criteria.interface';
import {PsrDataConsumerService} from '../../../core/services/psr-data-consumer.service';
import {NavbarComponent} from '../../../shared/components/navbar/navbar.component';
import {UserDetailsComponent} from '../../../shared/components/user-details/user-details.component';
import {FiltersComponent} from '../../../shared/components/filters/filters.component';
import {FilterPipe} from '../../../shared/pipes/filter.pipe';
import {AgentComponent} from "../../../agent/agent/agent.component";

@Component({
  selector: 'app-business-container',
  standalone: true,
  imports: [
    NavbarComponent,
    UserDetailsComponent,
    FiltersComponent,
    FilterPipe,
    AgentComponent,
  ],
  templateUrl: './business-container.component.html',
  styleUrl: './business-container.component.scss'
})
export class BusinessContainerComponent {

  public apiResponseData!: ApiResponse<UserList>;
  public userListConfig: IUserInformation[] = [];
  public expandedIndex: number | null = null;
  public filteredUsers!: IUserInformation[];
  public searchCriteria!: FilterPipeSearchCriteria;
  public selectedProvider!: string;
  public originalListConfig: IUserInformation[] = []

  constructor(private psrDataConsumerService: PsrDataConsumerService) {
  }

  ngOnInit() {
    this.getApiData();
  }

  public onSelectedItemIndexEmmiter(index: number) {
    this.expandedIndex === index
      ? this.expandedIndex = null
      : this.expandedIndex = index;
  }

  public onFiltersChanged(event: FilterPipeSearchCriteria) {
    this.searchCriteria = {...event};
    this.expandedIndex = null;
  }

  public onUpdate(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    const filtered = this.filterDevicesByCompany(this.originalListConfig, selectedValue); // temporaly data mock
    this.userListConfig = filtered
  }

  private getApiData(): void {
    this.psrDataConsumerService.getAllUsersData().subscribe(
      (res) => {
        if (res.status === 'OK') {
          this.apiResponseData = res;
          this.buildUserListConfig();
        }
      },
      (error) => {
        console.error('API Error', error);
      }
    )
  }

  private buildUserListConfig() {
    this.apiResponseData.data.items.forEach((item) => {
      this.originalListConfig.push(item.user);
    });
    const filtered = this.filterDevicesByCompany(this.originalListConfig, "CENS"); // mock logic
    this.userListConfig = filtered;
  }

  // mock method until backend supports and returns the original filtered data based on the rol
  private filterDevicesByCompany(users: IUserInformation[], provider: string): IUserInformation[] {
    return users.map(user => {
      const filteredAddresses = user.address
        .map(address => {
          const filteredDevices = address.devices.filter(device => device.provider === provider);

          if (filteredDevices.length > 0) {
            return {
              ...address,
              devices: filteredDevices
            };
          }
          return null;
        })
        .filter((address): address is Address => address !== null);

      return {
        ...user,
        address: filteredAddresses
      };
    }).filter(user => user.address.length > 0);
  }
}
