import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MeasureLayoutType } from '../../../core/enums/measure-layout-type';
import { Device } from '../../../core/interfaces';
import { ServiceStatusComponent } from "../service-status/service-status.component";
import { TranslationService } from '../../../core/services/translation.service';
import { SignalRService } from '../../../signalr/signal-rservice.service';

@Component({
  selector: 'measure',
  standalone: true,
  imports: [
    MatCardModule,
    ServiceStatusComponent,
    CommonModule
  ],
  templateUrl: './measure.component.html',
  styleUrls: ['./styles/measure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasureComponent {
  public layoutTypeEnum = MeasureLayoutType;
  public translations: any;
  reader: string = '';

  @Input() config!: Device;
  @Input() layoutType!: MeasureLayoutType;
  @Input() isClientDashboard!: boolean;

  constructor(private translationService: TranslationService, private cdr: ChangeDetectorRef, private signalRService: SignalRService) {}

  ngOnInit() {
    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
      this.cdr.markForCheck();
    });

    this.signalRService.startConnection();
    this.signalRService.addReceiveMessageListener((message) => {
      this.config.reader.reader = message;
      this.cdr.markForCheck();
    });
  }
}
