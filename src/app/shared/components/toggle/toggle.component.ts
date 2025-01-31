import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'toggle',
  standalone: true,
  imports: [],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'
})
export class ToggleComponent {

  @Input() label?: string; 
  @Input() checked = false;
  @Input() disabled = false;
  @Output() toggledEmitter = new EventEmitter<boolean>();

  onToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.toggledEmitter.emit(this.checked);
  }
}
