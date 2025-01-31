import { Component } from '@angular/core';
import { SignalRService } from '../signal-rservice.service';
import { CommonModule } from '@angular/common';
import { publishFacade } from '@angular/compiler';

@Component({
  selector: 'app-signal-rcomponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signal-rcomponent.component.html',
  styleUrls: ['./signal-rcomponent.component.scss'],
})
export class SignalRComponentComponent {
  messages: { message: string }[] = [];
  reader: string = '';

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addReceiveMessageListener((message) => {
      console.log(`Message: ${message}`);
      this.reader = message;
    });
  }
}
