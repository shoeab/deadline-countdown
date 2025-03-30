import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

export const deadlineMockInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (req.url.endsWith('/api/deadline')) {
    // Set your target deadline date and time
    const targetDate = new Date('2025-12-31T23:59:59');
    const now = new Date();
    // Calculate remaining seconds (ensuring we never go negative)
    const secondsLeft = Math.max(
      0,
      Math.floor((targetDate.getTime() - now.getTime()) / 1000)
    );

    // Return a mock response with countdown value
    return of(
      new HttpResponse({
        body: { secondsLeft },
        status: 200,
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
    );
  }

  // For requests not matching the endpoint, pass the request to the actual backend
  return next(req);
};
