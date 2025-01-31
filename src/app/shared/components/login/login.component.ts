import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginErrorStateMatcher } from './login-error-state-matcher';
import { Router } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { AuthService } from '@core/services/auth.service';
import { StorageKeyEnum } from '@core/enums/storage-keys.enum';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { TranslationService } from '@core/services/translation.service';

@Component({

  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    MatMenuModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./styles/login.component.scss']

})

export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public matcher = new LoginErrorStateMatcher();
  public translations: any;

  public selectedCountry: string = 'CO';
  public countries = [
    { name: 'United States', code: 'US', phoneCode: '1' },
    { name: 'Colombia', code: 'CO', phoneCode: '57' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({

      phone: new FormControl('', [
        Validators.required,

        Validators.pattern(/^\d{10}$/)
      ]),
    });

    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });
  }

  public onSubmit(): void {
    const phoneNumber = this.loginForm.controls['phone'].value
    if (phoneNumber && phoneNumber.length === 10) {

      this.storageService.setSessionStorage(StorageKeyEnum.Phone, phoneNumber);

      this.authService.verifyPhone(phoneNumber).subscribe(
        (res) => {
          if (res.status === 'OK') {
            this.router.navigateByUrl('auth/pin-confirmation');
          }
          else {
            console.error('authentication error')
          }
        },
        (error) => {
          console.error('Authentication error: ', error);
        }
      )
    }
  }


  public onLogin(): void {
    this.router.navigate(['auth/register']);

  }

  public onRegister(): void {
    this.router.navigate(['auth/register']);
  }

  // Number code
  public selectCountry(country: any): void {
    this.selectedCountry = country.code;
  }

  public getFlagImageUrl(code?: string): string {
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;
  }
}
