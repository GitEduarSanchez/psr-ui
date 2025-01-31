import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../../shared/components/navbar/navbar.component";
import {UserDetailsComponent} from "../../../shared/components/user-details/user-details.component";
import {PsrDataConsumerService} from '../../../core/services/psr-data-consumer.service';
import {ApiResponse, IUserInformation} from '../../../core/interfaces';
import {UserList} from '../../../core/interfaces/user-list.interface';
import {FiltersComponent} from '../../../shared/components/filters/filters.component';
import {FilterPipe} from "../../../shared/pipes/filter.pipe";
import {FilterPipeSearchCriteria} from '../../../shared/interfaces/filter-pipe-search-criteria.interface';
import {AgentComponent} from '../../../agent/agent/agent.component';
import { StorageService } from '../../../core/services/storage.service';
import { UserRole } from '../../../core/enums/user-role.enum';

@Component({
  selector: 'app-admin-container',
  standalone: true,
  imports: [
    NavbarComponent,
    UserDetailsComponent,
    FiltersComponent,
    FilterPipe,
    AgentComponent
  ],
  templateUrl: './admin-container.component.html',
  styleUrl: './admin-container.component.scss'
})
export class AdminContainerComponent implements OnInit {

  public apiResponseData!: ApiResponse<UserList>;
  public userListConfig: IUserInformation[] = [];
  public expandedIndex: number | null = null;

  public filteredUsers!: IUserInformation[];

  public searchCriteria!: FilterPipeSearchCriteria;

  constructor(
    private psrDataConsumerService: PsrDataConsumerService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.getApiData();
    this.saveUserTypeInSession();
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
      this.userListConfig.push(item.user);
    });
  }

    //TODO: Remove when Ngrx be implemented
    private saveUserTypeInSession() {
      this.storageService.setSessionStorage('role', UserRole.Client)
    }

}
