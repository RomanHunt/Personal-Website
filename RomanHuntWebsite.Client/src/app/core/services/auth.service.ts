import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserSession {
  userId: string | null;
  userName: string | null;
  sidebarExpanded: string | null;
  chatFolderId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Initialize the stream with whatever is currently in the cookies
  private currentUserSubject = new BehaviorSubject<UserSession>({
    userId: this.getCookie('userId'),
    userName: this.getCookie('userName'),
    sidebarExpanded: this.getCookie('sidebarExpanded'),
    chatFolderId: this.getCookie('chatFolderId')
  });

  // Expose this as an observable for components to subscribe to
  public currentUser$: Observable<UserSession> = this.currentUserSubject.asObservable();

  // Helper method to get current snapshot values
  public get currentUserValue(): UserSession {
    return this.currentUserSubject.value;
  }

  // Call this when the server returns a successful login response
  setSession(userId: string, userName: string) {
    this.setCookie('userId', userId, 7);
    this.setCookie('userName', userName, 7);

    // Notify all subscribers of the new state
    this.currentUserSubject.next({ userId, userName, sidebarExpanded: "true", chatFolderId: "1" });
  }

  // Call this when logging out
  clearSession() {
    this.deleteCookie('userId');
    this.deleteCookie('userName');

    // Notify all subscribers that the user is gone
    this.currentUserSubject.next({ userId: null, userName: null, sidebarExpanded: "true", chatFolderId: "1" });
  }

  /*
      userId: this.getCookie('userId'),
    userName: this.getCookie('userName'),
    sidebarExpanded: this.getCookie('sidebarExpanded'),
    chatFolderId: this.getCookie('chatFolderId')
  */

  setSidebarExpanded(isExpanded: string) {
    this.setCookie('sidebarExpanded', isExpanded, 7);

    this.currentUserSubject.next({
      userId: this.getCookie('userId'), userName: this.getCookie('userName'),
      sidebarExpanded: isExpanded, chatFolderId: this.getCookie('chatFolderId')
    });
  }

  setChatFolderId(chatFolderId: string) {
    this.setCookie('chatFolderId', chatFolderId, 7);

    this.currentUserSubject.next({
      userId: this.getCookie('userId'), userName: this.getCookie('userName'),
      sidebarExpanded: this.getCookie('sidebarExpanded'), chatFolderId: chatFolderId
    });
  }

  // --- Cookie Helper Methods ---
  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax; Secure`;
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=; max-age=-99999999; path=/; SameSite=Lax; Secure`;
  }
}
