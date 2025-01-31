import {Component, HostListener, Input} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {DeviceStatus} from "../../../core/interfaces";
import {TranslationService} from "../../../core/services/translation.service";
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '../../../shared/components/navbar/navbar.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AgentComponent} from '../../../agent/agent/agent.component';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FormsModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    AgentComponent,
  ],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss'
})
export class DeviceListComponent {
  @Input()
  public set devices(value: DeviceStatus[]) {
    this._devices = value || [];
    this.filterDevices();
  }

  public get devices(): DeviceStatus[] {
    return this._devices;
  }

  public filteredDevices: DeviceStatus[] = [];
  public selectedTime: string = 'all';
  public searchTerm: string = '';
  public currentPage: number = 0;
  public itemsPerPage: number = 10;
  public selectedDevice: DeviceStatus | null = null;
  public translations: any;
  public timeIcons: Record<'all' | '1 hour' | '6 hours' | '7 days' | '1 day' | '30 days', string> = {
    'all': 'assets/svg/check.svg',
    '1 hour': 'assets/svg/check.svg',
    '6 hours': 'assets/svg/check.svg',
    '7 days': 'assets/svg/check.svg',
    '1 day': 'assets/svg/check.svg',
    '30 days': 'assets/svg/check.svg',
  };

  private isFilterActive: boolean = false;
  private _devices: DeviceStatus[] = [];
  private timeMap: Record<'all' | '1 hour' | '6 hours' | '1 day' | '7 days' | '30 days', number> = {
    'all': Infinity,
    '1 hour': 1 * 60 * 60 * 1000,
    '6 hours': 6 * 60 * 60 * 1000,
    '1 day': 24 * 60 * 60 * 1000,
    '7 days': 7 * 24 * 60 * 60 * 1000,
    '30 days': 30 * 24 * 60 * 60 * 1000
  };

  constructor(private translationService: TranslationService) {
  }

  @HostListener('document:click', ['$event'])

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.status-dropdown') as HTMLElement;
    if (dropdown && !dropdown.contains(target) && !target.classList.contains('status-text')) {
      this.selectedDevice = null;
    }
  }

  public ngOnInit(): void {
    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });
    this.filterDevices();
  }

  public onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
  }


  public onStatusClick(status: string) {
    if (this.selectedDevice) {
      this.selectedDevice.errorReportAdmitted = status;
    }
  }

  public selectTime(time: string) {
    this.selectedTime = time;
    this.filterDevices();
  }

  public filterDevices() {
    this.filteredDevices = this.devices.filter(device =>
      device.deviceNumber.includes(this.searchTerm) ||
      device.error.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filterDevicesByTime();
    this.currentPage = 0;
  }

  private filterDevicesByTime() {
    const now = new Date();
    const timeLimit = this.timeMap[this.selectedTime as 'all' | '1 hour' | '6 hours' | '1 day' | '7 days' | '30 days'] || 0;
    this.filteredDevices = this.filteredDevices.filter(device => {
      const firstSeenDate = new Date(device.firstSeen);
      const timeDifference = now.getTime() - firstSeenDate.getTime();
      return timeDifference <= timeLimit;
    });
  }

  public formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options).replace(',', '');
  }

  public filterOpenErrors() {
    if (this.isFilterActive) {
      this.filteredDevices = this.devices;
      this.isFilterActive = false;
    } else {
      const notAdmittedDevices = this.devices.filter(device => device.errorReportAdmitted === 'not_admitted');
      const admittedDevices = this.devices.filter(device => device.errorReportAdmitted === 'admitted');
      this.filteredDevices = [...notAdmittedDevices, ...admittedDevices];
      this.isFilterActive = true;
    }
    this.filterDevicesByTime();
    this.currentPage = 0;
  }

  public get paginatedDevices() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredDevices.slice(start, end);
  }
}
