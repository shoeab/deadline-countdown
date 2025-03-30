import { ApplicationConfig } from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { deadlineMockInterceptor } from './interceptors/deadline.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([deadlineMockInterceptor])),
  ],
};
