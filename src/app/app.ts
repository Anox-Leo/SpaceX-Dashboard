import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StarfieldBackgroundComponent } from 'app/shared/starfield-background.component';
import { NavbarComponent } from 'app/shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StarfieldBackgroundComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('spacex-app');
}
