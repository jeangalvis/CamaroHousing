import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';
import {IConfig} from 'ngx-mask'

const maskConfig: Partial<IConfig> = {
  validation: false,

};

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideNgxMask()
  ]
};
