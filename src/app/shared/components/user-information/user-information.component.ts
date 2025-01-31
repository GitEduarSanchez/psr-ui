import { Component, Input, OnInit } from '@angular/core';
import { Address, IUserInformation } from '../../../core/interfaces';
import { UserInformationLayoutType } from '../../../core/enums/user-information-layout-type';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'user-information',
  standalone: true,
  imports: [],
  templateUrl: './user-information.component.html',
  styleUrls: ['./styles/user-information.component.scss']
})
export class UserInformationComponent implements OnInit {

  @Input() config!: IUserInformation;
  @Input() layoutType!: UserInformationLayoutType;
  @Input() selectedAdress!: Address;

  public layoutTypeEnum = UserInformationLayoutType;
  public translations: any;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    if (!this.selectedAdress) {
      this.selectedAdress = this.config.address[0];
    }

    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });
  }

}