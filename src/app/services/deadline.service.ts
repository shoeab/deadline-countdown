import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeadlineService {
  private http = inject(HttpClient);
  secondsLeft = signal<number>(0);

  constructor() {
    this.startPolling();
  }

  private startPolling(): void {
    interval(1000)
      .pipe(
        switchMap(() =>
          this.http.get<{ secondsLeft: number }>('/api/deadline')
        ),
        tap((response) => this.secondsLeft.set(response.secondsLeft))
      )
      .subscribe();
  }
}
