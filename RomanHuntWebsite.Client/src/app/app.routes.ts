import { Routes } from '@angular/router';
import { HomePage } from '../app/modules/main/pages/home/home.page';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule) 
  }
];
