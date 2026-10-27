import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as General from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public static adminMarketplaceApiVersion = "x-val-admin-marketplace-api-version";
  private static adminMarketplaceApiVersionNumber = "3";

  constructor(private http: HttpClient,
@Inject("API_BASE_URL") private apiBaseUrl: string) {
  }

  getSampleData(): Observable<General.TestClass> {
    return this.http.get<General.TestClass>(
      this.apiBaseUrl + '/General/TestController');
  }

  createUser(model: General.NewUserSubmit): Observable<General.NewUserReturn> {
    return this.http.post<General.NewUserReturn>(
      this.apiBaseUrl + '/General/NewUser', model);
  }

  login(model: General.LoginSubmit): Observable<General.LoginReturn> {
    return this.http.post<General.LoginReturn>(
      this.apiBaseUrl + '/General/Login', model);
  }

  sendUserEmail(model: General.AccountEmailSubmit): Observable<General.AccountEmailReturn> {
    return this.http.post<General.AccountEmailReturn>(
      this.apiBaseUrl + '/General/UserEmail', model);
  }

  resetPassword(model: General.ChangePasswordSubmit): Observable<General.ChangePasswordReturn> {
    return this.http.post<General.ChangePasswordReturn>(
      this.apiBaseUrl + '/General/ResetPassword', model);
  }

  getChatFolder(model: General.GetChatFolderSubmit): Observable<General.GetChatFolderReturn> {
    return this.http.post<General.GetChatFolderReturn>(
      this.apiBaseUrl + '/General/ChatFolder', model);
  }

  createChatFolder(model: General.CreateChatFolderSubmit): Observable<General.GetChatFolderReturn> {
    return this.http.post<General.GetChatFolderReturn>(
      this.apiBaseUrl + '/General/CreateChatFolder', model);
  }

  getChat(model: General.GetChatSubmit): Observable<General.GetChatReturn> {
    return this.http.post<General.GetChatReturn>(
      this.apiBaseUrl + '/General/Chat', model);
  }

  createChat(model: General.CreateChatSubmit): Observable<General.CreateChatReturn> {
    return this.http.post<General.CreateChatReturn>(
      this.apiBaseUrl + '/General/CreateChat', model);
  }

  createMessage(model: General.CreateChatMessageSubmit): Observable<General.GetChatReturn> {
    return this.http.post<General.GetChatReturn>(
      this.apiBaseUrl + '/General/CreateMessage', model);
  }

  getChatFolderRoot(model: General.GetChatFolderSubmit): Observable<General.GetChatFolderRoot> {
    return this.http.post<General.GetChatFolderRoot>(
      this.apiBaseUrl + '/General/ChatFolderRoot', model);
  }
  getUserSettings(userId: number): Observable<General.UserSettings> {
    return this.http.get<General.UserSettings>(
      this.apiBaseUrl + '/General/UserSettings/' + userId);
  }

  saveUserSettings(model: General.UserSettingsSubmit): Observable<General.UserSettingsSubmitResult> {
    return this.http.post<General.UserSettingsSubmitResult>(
      this.apiBaseUrl + '/General/SaveUserSettings', model);
  }

  // Upload the avatar file using FormData
  uploadAvatar(userId: number, file: File): Observable<General.SetAvatarReturn> {
    const formData = new FormData();
    formData.append('avatar', file); // 'file' must match the parameter name in .NET Core

    return this.http.post<General.SetAvatarReturn>(
      this.apiBaseUrl + '/General/UploadAvatar/' + userId + '/avatar', formData);
  }




}
