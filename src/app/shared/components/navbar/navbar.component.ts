import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { LoginComponent } from "../login/login.component";
import { TranslationService } from '@core/services/translation.service';
import { Language } from '@core/interfaces/language.interface';
import { Translations } from '@core/interfaces/translations.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    MatButtonModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./styles/navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  public languages: Language[] = [];
  public selectedLanguage: Language | null = null;
  public dropdownOpen = false;
  public translations: any;

  constructor(private translationService: TranslationService, private cdr: ChangeDetectorRef, private eRef: ElementRef) { }

  @ViewChild('profileButton') profileButton!: ElementRef;
  @ViewChild('headerContainer', { static: false }) headerContainer!: ElementRef;


  ngOnInit(): void {
    this.translationService.languages$.subscribe(languages => {
      this.languages = languages;
      this.cdr.detectChanges();
    });

    this.translationService.selectedLanguage$.subscribe(selectedLanguage => {
      this.selectedLanguage = selectedLanguage;
      this.cdr.detectChanges();
    });
  }

  selectLanguage(language: Language): void {
    this.translationService.selectLanguage(language);
    this.dropdownOpen = false;
  }

  getFlagImageUrl(code?: string): string {
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;
  }

  getTranslations(): Translations | null {
    return this.translationService.getTranslations();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const headerContainerElement = this.headerContainer?.nativeElement;
    const profileButtonElement = this.profileButton?.nativeElement;

    if (!headerContainerElement || !profileButtonElement) {
      return;
    }

    const clickedInsideHeader = headerContainerElement.contains(event.target);
    const clickedInsideDropdown = this.eRef.nativeElement.contains(event.target);

    if (!clickedInsideHeader && !clickedInsideDropdown) {
      this.dropdownOpen = false;
      this.cdr.detectChanges();
    }
  }

  getFilteredLanguages(): Language[] {
    return this.languages.filter(language => language.tag !== this.selectedLanguage?.tag);
  }
}


// TODO: Validar modal mas adelante

// openProfileDialog(event: Event) {
//   const buttonElement = this.profileButton.nativeElement.getBoundingClientRect();
//   const position = {
//     top: `${buttonElement.bottom}px`,
//     left: `${buttonElement.left}px`
//   }

//   const dialogRef = this.dialogService.openModal(LoginComponent, {}, false, position);

//   dialogRef.afterClosed().subscribe(result => {
//     console.log('The dialog was closed');
//   });

// }

// public openDialog(template?: TemplateRef<any>): void {
//   const config: DialogConfig = {
//     showButtons: false,
//   }

//   this.dialogService.openModal(LoginComponent);
// }


