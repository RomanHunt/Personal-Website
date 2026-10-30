import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AboutPage } from '../main/pages/about/about.page';
import { ContactPage } from '../main/pages/contact/contact.page';
import { HomePage } from '../main/pages/home/home.page';
import { ResumePage } from '../main/pages/resume/resume.page';
import { ResetPasswordPage } from '../main/pages/reset-password/reset-password.page';
import { UserSettingsPage } from '../main/pages/user-settings/user-settings.page';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivateAccountPage } from '../main/pages/activate-account/activate-account.page';

const MODULE_ROUTES: Routes = [
  {
    path: 'about', component: AboutPage
  },
  {
    path: 'contact', component: ContactPage
  },
  {
    path: 'home', component: HomePage
  },
  {
    path: 'resume', component: ResumePage
  },
  {
    path: '', component: HomePage
  },
  {
    path: 'reset-password', component: ResetPasswordPage
  },
  {
    path: 'user-settings', component: UserSettingsPage
  },
  {
    path: 'activate-account', component: ActivateAccountPage
  }
];

@NgModule({
  declarations: [
    AboutPage,
    ContactPage,
    HomePage,
    ResumePage,
    ResetPasswordPage,
    UserSettingsPage,
    ActivateAccountPage
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MODULE_ROUTES),
    ReactiveFormsModule
  ],
  exports: [
    AboutPage,
    HomePage,
    ContactPage,   
    ResumePage,
    ResetPasswordPage,
    UserSettingsPage,
    ActivateAccountPage
  ]
})
export class MainModule { }
