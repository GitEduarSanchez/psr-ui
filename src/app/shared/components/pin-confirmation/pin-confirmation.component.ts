import {CommonModule} from '@angular/common';
import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Router, RouterModule} from '@angular/router';
import {StorageService} from '../../../core/services/storage.service';
import {AuthService} from '../../../core/services/auth.service';
import {Login} from '../../../core/interfaces/login.interface';
import {ApiResponse} from '../../../core/interfaces';
import {StorageKeyEnum} from '../../../core/enums/storage-keys.enum';
import {TranslationService} from '../../../core/services/translation.service';

@Component({
  selector: 'pin-confirmation',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './pin-confirmation.component.html',
  styleUrl: './styles/pin-confirmation.component.scss',
})
export class PinConfirmationComponent {

  public title = 'pin-confirmation';
  public pinValue: string = '';
  public masked = [false, false, false, false]
  public isInputActive = false;
  public loginData!: Login;
  public phoneNumber: string | null = '';

  public isInvalid = false;
  public translations: any;

  @ViewChild('pinInput') pinInputElement!: ElementRef<HTMLInputElement>;
  @ViewChildren('pinBox') pinBoxes!: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private translationService: TranslationService
  ) {
  }

  ngOnInit(): void {
    this.phoneNumber = this.storageService.getSessionStorage(StorageKeyEnum.Phone);

    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });
  }

  focusInput(): void {
    this.isInputActive = true;
    if (this.pinInputElement && this.isInputActive) {
      const inputElement = this.pinInputElement.nativeElement;
      inputElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const allowedKeys = new Set(['Backspace', 'Delete', 'Tab', 'Enter']);
    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber && !allowedKeys.has(event.key)) {
      event.preventDefault();
    }
  }

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.pinValue = inputValue;
    this.updatePinBoxes();
  }

  updatePinBoxes(): void {
    this.pinBoxes.forEach((box, index) => {
      const element = box.nativeElement as HTMLElement;
      this.updatePinBoxContent(index, element);
      this.activatePinBox(index, element);
    });

    if (this.pinValue.length === 4) {
      this.validateAccessAndRedirect();
    }
  }

  private updatePinBoxContent(index: number, element: HTMLElement): void {
    if (this.pinValue[index]) {
      const currentSpan = element.querySelector('span');
      if (!currentSpan || currentSpan.textContent !== this.pinValue[index]) {
        element.innerHTML = `<span class="fade-in-up">${this.pinValue[index]}</span>`;
        this.maskInputBox(index);
      }
    } else {
      element.innerHTML = '';
      this.masked[index] = false;
    }
  }

  private activatePinBox(index: number, element: HTMLElement): void {
    const isCurrentBoxActive = index === this.pinValue.length;
    if (isCurrentBoxActive) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  }

  public focusInFirstInput() {
    if (this.pinValue.length === 0) {
      const firstBox = this.pinBoxes.first.nativeElement as HTMLElement;
      firstBox.classList.add('active');
    }
  }

  private validateAccessAndRedirect() {
    const phoneSessionValue = this.storageService.getSessionStorage(StorageKeyEnum.Phone);
    if (phoneSessionValue) {
      const phone = String(phoneSessionValue);

      this.loginData = {
        codeCountry: '+57',
        phone: phone,
        password: this.pinValue
      };

      this.authService.login(this.loginData).subscribe(
        (res: ApiResponse) => {
          if (res.data) {
            this.storageService.setSessionStorage(StorageKeyEnum.AuthenticationToken, res.data);
            this.isInvalid = false;
            this.router.navigate(['/']);
          } else {
            this.isInvalid = true;
          }
        },
        (error) => {
          console.error('Authentication error: ', error);
          this.isInvalid = true;
        }
      )
    }
  }

  private maskInputBox(index: number): void {
    this.masked[index] = false;
    setTimeout(() => {
      this.masked[index] = true;
    }, 500);
  }
}
