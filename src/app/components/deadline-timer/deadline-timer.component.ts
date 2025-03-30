import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlineService } from '../../services/deadline.service';

@Component({
  selector: 'app-deadline-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="countdown">
      <p>Seconds left to deadline: {{ secondsLeft() }}</p>
    </div>
  `,
  styles: [
    `
      .countdown {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: #f9f9f9;
      }
    `,
  ],
})
export class DeadlineTimerComponent {
  private deadlineService = inject(DeadlineService);
  secondsLeft = computed(() => this.deadlineService.secondsLeft());
}
