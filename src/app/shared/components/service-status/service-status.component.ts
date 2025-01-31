import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ServiceState } from '../../../core/interfaces/service-state.interface';

@Component({
  selector: 'service-status',
  standalone: true,
  imports: [],
  templateUrl: './service-status.component.html',
  styleUrl: './styles/service-status.component.scss'
})
export class ServiceStatusComponent implements AfterViewInit, OnChanges {

  @Input({ required : true}) config!: ServiceState;

  @ViewChild('ledElement') ledElement!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (this.config.state) { 
      this.toggleActiveClass(this.config.state)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.toggleActiveClass(this.config.state)
  }

  private toggleActiveClass(state: boolean) {
    if (this.ledElement) {
      state === true
      ? this.renderer.addClass(this.ledElement.nativeElement, 'active')
      : this.renderer.removeClass(this.ledElement.nativeElement, 'active');
    }
  }
}
