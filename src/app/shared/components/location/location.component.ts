import { CommonModule } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { UserRole } from '../../../core/enums/user-role.enum';
import { StorageService } from '../../../core/services/storage.service';
import { TranslationService } from '../../../core/services/translation.service';
import { DialogConfig } from '../../interfaces/dialog-config.interface';
import { FormConfig } from '../../interfaces/form-config.interface';
import { DialogService } from '../../services/dialog.service';
import { FormService } from '../../services/form.service';
import { PsrFormComponent } from "../psr-form/psr-form.component";
import { Marker } from './interfaces/marker.interface';

@Component({
  selector: 'location',
  standalone: true,
  imports: [
    GoogleMapsModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    PsrFormComponent
],
  templateUrl: './location.component.html',
  styleUrl: './styles/location.component.scss'
})

export class LocationComponent {

  public userRole = UserRole;
  public role!: UserRole
  public translations: any;
  public defaultPosition: google.maps.LatLngLiteral | google.maps.LatLng = { lat: 4.192437, lng: -74.4265938 }
  public mapOptions: google.maps.MapOptions = {
    fullscreenControl: false,
  };
  public markers: Marker[] = [];
  public currentMarker: Marker = this.createEmptyMarker();
  public markerFormConfig!: FormConfig;
  public  markerForm!: FormGroup;

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild(MapInfoWindow) infoWindowRef!: MapInfoWindow;

  constructor(
    private translationService: TranslationService,
    private dialogService: DialogService,
    private storageService: StorageService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.role = this.getUserRoleFromSession();
    this.buildForm();
    this.markers = this.storageService.getSessionStorage('markers') || [];
    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });
  }

  public buildForm() {
    this.markerFormConfig = this.formService.buildLocationFormConfig()
  }

  public onSubmit(formValue: any): void {
    const newMarker: Marker = {
      ...formValue,
      position: { ...this.currentMarker.position },
    };

    this.markers.push(newMarker);
    this.storageService.setSessionStorage('markers',this.markers);
    this.notifyDeviceRegistration();
    this.closeForm();
  }

  public openForm(event: google.maps.MapMouseEvent, template: TemplateRef<any>) {
    if (event && event.latLng && this.role === this.userRole.Operator) {
      this.currentMarker.position.lat = event.latLng.lat();
      this.currentMarker.position.lng = event.latLng.lng();
      const modalData: DialogConfig = {
        contentTemplate: template
      }
      this.dialogService.open(modalData)
    }
  }

  public openInfoWindow(marker: Marker ,markerRef: MapAdvancedMarker) {
    const content = `<div class='info-window'>
                        <div class="info-window-item">
                          <span class="info-window-item-title">Code: </span>
                          <span class="info-window-item-description">${marker.code}</span>
                        </div>
                        <div class="info-window-item">
                          <span class="info-window-item-title">TRT: </span>
                          <span class="info-window-item-description">${marker.trt}</span>
                        </div>
                        <div class="info-window-item">
                          <span class="info-window-item-title">Phone: </span>
                          <span class="info-window-item-description">${marker.phone}</span>
                        </div>
                        <div class="info-window-item">
                          <span class="info-window-item-title">Position: </span>
                          <span class="info-window-item-description">${marker.position.lat}, ${marker.position.lng}</span>
                        </div>
                        ${marker.photo ? `<img class="info-window-image" src="${marker.photo}">` : ''}
                     </div>
                    `;

    this.infoWindowRef.open(markerRef, false, content);
  }

  public closeForm() {
    this.dialogService.close();
    this.markerForm.reset();
    this.currentMarker = this.createEmptyMarker();
  }

  public getMapHeight(): string {
    switch (this.role) {
      case this.userRole.Client:
      case this.userRole.Admin:
        return '390px';
      case this.userRole.Operator:
        return '350px';
      default:
        return '0';
    }
  }

  private createEmptyMarker(): Marker {
    return {
      code: '',
      position: { lat: 0, lng: 0 },
      trt: '',
      phone: '',
      photo: '',
    };
  }

  private notifyDeviceRegistration() {
    Swal.fire({
      title: "successful registration",
      icon: "success"
    });
  }

  //TODO: Remove when Ngrx be implemented
  private getUserRoleFromSession() {
    return this.storageService.getSessionStorage('role')
  }
}
