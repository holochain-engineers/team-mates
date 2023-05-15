import { bootstrapApplication } from '@angular/platform-browser';
//import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HolochainService } from './app/services/holochain.service';
import { APP_INITIALIZER } from '@angular/core';

export function initializeConnection(holochainService: HolochainService) {
  return (): Promise<any> => { 
    return holochainService.init();
  }
}

export const appConfig = {
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeConnection, deps: [HolochainService], multi: true}
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));