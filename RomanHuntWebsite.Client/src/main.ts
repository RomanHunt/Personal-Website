import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { StaticProvider } from '@angular/core';

const providers: StaticProvider[] = [
  { provide: 'API_BASE_URL', useValue: environment.apiUrl }
];

platformBrowser(providers).bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
