import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SwitchStatus} from '../../../core/interfaces/switch-status.interface';
import {SwitchService} from '../../../core/services/switch.service';
import {TranslationService} from '../../../core/services/translation.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {NavbarComponent} from '../../../shared/components/navbar/navbar.component';
import {AgentComponent} from "../../../agent/agent/agent.component";

@Component({
  selector: 'app-switch-control',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, NavbarComponent, AgentComponent],
  templateUrl: './switch-control.component.html',
  styleUrls: ['./switch-control.component.scss']
})
export class SwitchControlComponent implements OnInit {
  switches: SwitchStatus = {
    id: '',
    valve: null,
    solenoidValve: null,
    bomb: null,
    circuit: null,
    raspberry: null
  };

  originalSwitches: SwitchStatus = {...this.switches};

  isLoading: boolean = true;
  updating: boolean = false;
  public translations: any;


  constructor(private switchService: SwitchService, private translationService: TranslationService) {
  }

  ngOnInit(): void {
    this.getSwitchStatuses();

    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });
  }

  getSwitchStatuses(): void {
    this.switchService.getAllSwitches().subscribe({
      next: (data) => {
        this.switches = data;
        this.originalSwitches = {...data};
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching switch statuses', err);
        this.isLoading = false;
      }
    });
  }

  toggleSwitch(switchName: keyof Omit<SwitchStatus, 'id'>): void {
    if (!this.isLoading && this.switches[switchName] !== null) {
      this.switches[switchName] = !this.switches[switchName];
    }
  }

  updateSwitches(): void {
    this.updating = true;
    this.switchService.updateSwitches(this.switches).subscribe({
      next: () => {
        this.originalSwitches = {...this.switches};
        this.updating = false;
      },
      error: (err) => {
        console.error('Error updating switches', err);
        this.updating = false;
      }
    });
  }

  cancelChanges(): void {
    this.switches = {...this.originalSwitches};
  }

  hasChanges(): boolean {
    return JSON.stringify(this.switches) !== JSON.stringify(this.originalSwitches);
  }
}
