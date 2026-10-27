import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, ReplaySubject, Observable } from 'rxjs';
import { CreateUserModalComponent } from '../../../core/components/create-user-modal/create-user-modal.component';
import { LoginModalComponent } from '../../../core/components/login-modal/login-modal.component';
import { AuthService, UserSession } from '../../services/auth.service';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styles: [],
  standalone: false
})
export class LayoutMainComponent implements OnInit, OnDestroy {
  @ViewChild(CreateUserModalComponent) createUserModal: CreateUserModalComponent;
  @ViewChild(LoginModalComponent) loginModal: LoginModalComponent;

  userSession$: Observable<UserSession>;
  subscription = new Subscription();
  isMenuOpen = false;

  constructor(private authService: AuthService) {
    // Reference the observable stream directly
    this.userSession$ = this.authService.currentUser$;
  }

  ngOnInit() {

  }

  openCreateUser() {
    this.createUserModal.open();
  }

  openLogin() {
    this.loginModal.open();
  }

  logout() {
    this.authService.clearSession();
    window.location.reload();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Prevent background scrolling when full-screen menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
