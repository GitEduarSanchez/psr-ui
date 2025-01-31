import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authcontainer',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './authcontainer.component.html',
  styleUrl: './authcontainer.component.scss'
})
export class AuthcontainerComponent {

}
