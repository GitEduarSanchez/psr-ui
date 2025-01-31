import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
  QueryList,
  ViewChildren
} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {Address, Device, IUserInformation} from '../../../core/interfaces';
import {HistoryComponent} from '../../../shared/components/history/history.component';
import {LocationComponent} from "../../../shared/components/location/location.component";
import {MeasureComponent} from '../../../shared/components/measure/measure.component';
import {NavbarComponent} from '../../../shared/components/navbar/navbar.component';
import {ServiceStatusComponent} from "../../../shared/components/service-status/service-status.component";
import {UserInformationComponent} from "../../../shared/components/user-information/user-information.component";
import {MatTabChangeEvent, MatTabsModule, MatTab} from '@angular/material/tabs';
import {CommonModule} from '@angular/common';
import {BarChartGraphComponent} from '../../../shared/components/bar-chart-graphic/bar-chart-graph.component';
import {AgentComponent} from '../../../agent/agent/agent.component';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    MeasureComponent,
    UserInformationComponent,
    ServiceStatusComponent,
    HistoryComponent,
    MatGridListModule,
    NavbarComponent,
    LocationComponent,
    MatTabsModule,
    CommonModule,
    BarChartGraphComponent,
    AgentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./styles/dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

  public selectedDevice!: Device;
 
  @Input() config!: IUserInformation;
  @Input() isExpanded!: boolean;
  @Input() selectedAddress!: Address;
  @Input() isClientDashboard!: boolean;

  @Output() selectedAddressEmitter = new EventEmitter<Address>();
  @ViewChildren(MatTab) tabs!: QueryList<MatTab>;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  public selectDevice(device: Device): void {
    this.selectedDevice = device;
  }

  ngAfterViewInit(): void {
    this.tabs.changes.subscribe(() => {
      this.detectTabsLoaded();
    });
  }

  private detectTabsLoaded(): void {
    this.onButtonClick();
  }

  public onTabChange(event: MatTabChangeEvent) {
    this.selectedDevice = this.config.address[event.index].devices[0];
    this.selectedAddressEmitter.emit(this.config.address[event.index]);
  }

  public onButtonClick() {
    setTimeout(() => {
      const userDetailsContent = this.el.nativeElement.querySelector('.mat-mdc-tab-header');

      if (userDetailsContent) {
        this.renderer.addClass(userDetailsContent, 'custom-tab-header');
      }
    }, 0);
  }
}
