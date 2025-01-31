import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { MeasureLayoutType } from '../../../core/enums/measure-layout-type';
import { UserInformationLayoutType } from '../../../core/enums/user-information-layout-type';
import { Address, IUserInformation } from '../../../core/interfaces';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { MeasureComponent } from "../measure/measure.component";
import { UserInformationComponent } from "../user-information/user-information.component";

@Component({
  selector: 'user-details',
  standalone: true,
  imports: [
    UserInformationComponent,
    MeasureComponent,
    DashboardComponent,
    CommonModule
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],

})
export class UserDetailsComponent {

  public userInformationLayoutType = UserInformationLayoutType;
  public measureLayoutType = MeasureLayoutType;
  public selectedAddress!: Address;

  @Input() config!: IUserInformation;
  @Input() expanded!: boolean;
  @Input() index!: number;

  @Output() selectedItemIndexEmitter = new EventEmitter<number>();

  constructor(private renderer: Renderer2, private el: ElementRef) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.selectedAddress = this.config.address[this.index];
    }
  }

  public onSelectedAddressEmitter(event: Address) {
    this.selectedAddress = event;
  }

  public toggleExpand(index: number): void {
    this.selectedAddress = this.config.address[index];
    this.selectedItemIndexEmitter.emit(index);
    this.expanded = !this.expanded;

    if (this.expanded) {
      setTimeout(() => {
        const userDetailsContent = this.el.nativeElement.querySelector('.mat-mdc-tab-header');

        if (userDetailsContent) {
          this.renderer.addClass(userDetailsContent, 'expanded-tab-header');
        }
      }, 0);
    }
  }

}
