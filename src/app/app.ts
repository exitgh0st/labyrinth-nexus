import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionTimeoutWarning } from './features/session/components/session-timeout-warning/session-timeout-warning';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SessionTimeoutWarning],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('labyrinth-nexus');
}
