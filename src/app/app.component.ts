import { Component } from '@angular/core';
import { DeadlineTimerComponent } from './components/deadline-timer/deadline-timer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DeadlineTimerComponent],
  template: `<app-deadline-timer></app-deadline-timer>`,
})
export class AppComponent {}
