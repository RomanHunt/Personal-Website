import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject, ViewEncapsulation } from '@angular/core';
import { GeneralService } from '../app/core/services/general.service';
import * as Models from '../app//shared/models/models';
import { AuthService, UserSession } from '../app/core/services/auth.service';
import { Subscription, ReplaySubject, Observable } from 'rxjs';
import { ChatModalComponent } from '../app/core/components/chat-modal/chat-modal.component';

import {
  UntypedFormBuilder, UntypedFormGroup, Validators, FormArray, FormControl, UntypedFormControl,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  isCollapsed = true;
  private cdr = inject(ChangeDetectorRef);
  confirming = false;
  model!: UntypedFormGroup;
  errorMsg?: string;
  users: Models.UserSummary [] = [];
  loaded: boolean = false;
  folder: Models.GetChatFolderReturn;
  title = 'RomanHuntWebsite.Client';
  sidebarLoaded: boolean;

  sidePanelModes = { 'List': 1, 'CreateFolder': 2, 'CreateChat': 3 };
  currentPanelMode: number;
  activeUserId: number;
  userSession$: UserSession;

  @ViewChild(ChatModalComponent) chatModal: ChatModalComponent;

  constructor(private http: HttpClient, private generalSvc: GeneralService, private fb: UntypedFormBuilder,
    private authService: AuthService) {
    this.userSession$ = authService.currentUserValue;
  }

  ngOnInit() {
    this.model = this.fb.group({
      name: ['', Validators.required],
      isPublic: [true],
      userIds: this.fb.array([]),
    });
    this.isCollapsed = this.userSession$.sidebarExpanded === "true" ? false : true;
    this.loaded = true;
    this.cdr.detectChanges();
    this.loadSidebar();
  }

  loadSidebar() {
    this.activeUserId = Number(this.userSession$.userId);
    const folderId: number = this.userSession$.chatFolderId ? Number(this.userSession$.chatFolderId) : 1;

    const model: Models.GetChatFolderSubmit = {
      chatFolderId: folderId,
      userId: this.activeUserId
    };

    this.generalSvc.getChatFolderRoot(model).subscribe({
      next: result => {
        this.users = result.userIds;
        this.folder = result.rootChatFolder;
        this.currentPanelMode = this.sidePanelModes.List;
        this.sidebarLoaded = true;
        this.cdr.detectChanges();
      },
      error: error => {
        this.confirming = false;
        this.errorMsg = "An error occurred while attempting to load the root chat folder";
        this.cdr.detectChanges();
        console.error(error);
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    const str = this.isCollapsed ? "false" : "true";
    this.authService.setSidebarExpanded(str);

    if (!this.isCollapsed) {
      this.close();
    }
  }

  get f() { return this.model.controls; }


  getModelValidity() {
    return this.model.valid;
  }

  close() {
    this.model.reset();
    this.f.isPublic.setValue(true);
    this.currentPanelMode = this.sidePanelModes.List;
  }

  createFolder() {
    this.currentPanelMode = this.sidePanelModes.CreateFolder;
  }

  createChat() {
    this.currentPanelMode = this.sidePanelModes.CreateChat;
  }

  openFolder(id: number) {

    if (this.confirming === false) {
      this.confirming = true;
      const submit: Models.GetChatFolderSubmit = {
        chatFolderId: id,
        userId: this.activeUserId
      };

      this.generalSvc.getChatFolder(submit).subscribe({
        next: result => {
          this.model.reset();
          this.f.isPublic.setValue(true);
          this.folder = result;
          this.confirming = false;
          this.authService.setChatFolderId(result.chatFolderId.toString());
          this.cdr.detectChanges();
        },
        error: error => {
          this.confirming = false;
          this.errorMsg = "An error occurred while attempting to create the chat folder";
          this.cdr.detectChanges();
          console.error(error);
        }
      });
    }
  }

  openChat(id: number) {
    if (this.confirming === false) {
      this.confirming = true;
      const submit: Models.GetChatSubmit = {
        chatId: id,
        userId: this.activeUserId,
        pageNumber: 0
      };

      this.generalSvc.getChat(submit).subscribe({
        next: result => {
          this.confirming = false;

          this.chatModal.open(result, this.activeUserId, this.users);
        },
        error: error => {
          this.confirming = false;
          this.errorMsg = "An error occurred while attempting to create the chat folder";
          this.cdr.detectChanges();
          console.error(error);
        }
      });
    }
  }

  submitRequest() {

    const checkArray: FormArray = this.selectedItems;

    if (this.currentPanelMode === this.sidePanelModes.CreateFolder) {
      this.confirming = true;
      const submit: Models.CreateChatFolderSubmit = {
        isPublic: this.f.isPublic.value,
        allowedUserIds: this.f.userIds.value,
        chatName: this.f.name.value,
        parentFolderId: this.folder.chatFolderId,
        userId: this.activeUserId
      };

      if (submit.isPublic) {
        submit.allowedUserIds = [];
      }
      else {
        if (submit.allowedUserIds.includes(this.activeUserId) === false) {
          submit.allowedUserIds.push(this.activeUserId);
        }

        submit.allowedUserIds = submit.allowedUserIds.filter(o => o !== null && o !== undefined);
        submit.allowedUserIds = [...new Set(submit.allowedUserIds)];
      }

      this.generalSvc.createChatFolder(submit).subscribe({
        next: result => {
          this.close();
          this.cdr.detectChanges();
          this.confirming = false;
          this.openFolder(result.parentChatFolderId);
        },
        error: error => {
          this.confirming = false;
          this.errorMsg = "An error occurred while attempting to create the chat folder";
          console.error(error);
        }
      });
    } else if (this.currentPanelMode === this.sidePanelModes.CreateChat) { 
      this.confirming = true;
      const submit: Models.CreateChatSubmit = {
        isPublic: this.f.isPublic.value,
        allowedUserIds: this.f.userIds.value,
        chatName: this.f.name.value,
        parentFolderId: this.folder.chatFolderId,
        userId: this.activeUserId,        
      };

      if (submit.isPublic) {
        submit.allowedUserIds = [];
      }
      else {
        if (submit.allowedUserIds.includes(this.activeUserId) === false) {
          submit.allowedUserIds.push(this.activeUserId);
        }

        submit.allowedUserIds = submit.allowedUserIds.filter(o => o !== null && o !== undefined);
        submit.allowedUserIds = [...new Set(submit.allowedUserIds)];
      }

      this.generalSvc.createChat(submit).subscribe({
        next: result => {
          this.close();
          this.cdr.detectChanges();
          this.confirming = false;
          this.openFolder(this.folder.chatFolderId); // Refresh current folder
        },
        error: error => {
          this.confirming = false;
          this.errorMsg = "An error occurred while attempting to create the chat";
          console.error(error);
        }
      });
    }
  }

  get selectedItems(): FormArray {
    return this.model.get('userIds') as FormArray;
  }

  onCheckboxChange(event: any, id: number) {
    const checkArray: FormArray = this.selectedItems;

    if (event.target.checked) {
      checkArray.push(new FormControl(id));
    } else {
      let i = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.id == id) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  isChecked(id: number): boolean {
    if (!this.selectedItems) {
      return false;
    }
    return this.selectedItems.controls.some(item => item.value === id);
  }

  goUpFolderLevel()
  {
    this.openFolder(this.folder.parentChatFolderId ?? 1);
  }
}
