import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule, UrlSerializer } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutMainComponent } from './core/components/layout-main/layout-main.component';
import { APP_ROUTES } from './app.routes';
import { CreateUserModalComponent } from './core/components/create-user-modal/create-user-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginModalComponent } from './core/components/login-modal/login-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatModalComponent } from './core/components/chat-modal/chat-modal.component';
import { QuillModule } from 'ngx-quill'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeHtmlPipe } from './safe-html-pipe'

@NgModule({
  declarations: [
    AppComponent,
    LayoutMainComponent,
    CreateUserModalComponent,
    LoginModalComponent,
    ChatModalComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule, HttpClientModule, ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules }),
    FontAwesomeModule,
    QuillModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
