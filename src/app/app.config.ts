import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { infraProviders } from './infra/infra.provider';
import { servicesProvider } from './services/services.provider';
import { usecasesProviders } from './usecases/usecases.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    infraProviders(),
    servicesProvider(), 
    usecasesProviders()
  ]
};
