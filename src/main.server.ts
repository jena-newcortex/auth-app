import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
if (environment.production) {
  enableProdMode();
}

export { AppServerModule as default } from './app/app.module.server';
export { renderModule } from '@angular/platform-server';

