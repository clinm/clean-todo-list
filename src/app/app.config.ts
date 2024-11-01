import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { servicesProvider } from './services/services.provider';
import { usecasesProviders } from './usecases/usecases.provider';
import { environment } from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    environment.infraProvider(),
    servicesProvider(), 
    usecasesProviders()
  ]
};
