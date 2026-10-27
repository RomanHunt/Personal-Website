/*
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import * as Models from '../../../shared/models/models';
import { AuthService, UserSession } from '../../services/auth.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styles: [],
  standalone: false
})
export class ChatPanelComponent implements OnInit {

  isCollapsed = false;

  private cdr = inject(ChangeDetectorRef); 
  confirming = false;
  model!: UntypedFormGroup;
  errorMsg?: string;
  emailMsg?: string;
  emailModel!: UntypedFormGroup;
  users: Models.KeyValue[] = [];
  loaded: boolean = false;
  folder: Models.GetChatFolderReturn;

  @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;

  constructor(private fb: UntypedFormBuilder, private generalSvc: GeneralService, private authService: AuthService){}

  ngOnInit() {
    this.model = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.generalSvc.getChatFolderRoot().subscribe({
      next: result => {
        this.users = result.userIds;
        this.folder = result.rootChatFolder;

        this.loaded = true;

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
  }

  get f() { return this.model.controls; }


  getModelValidity() {
    return this.model.valid;
  }

  createFolder() {

  }

  createChat() {

  }

  openFolder() {

  }

  openChat() {

  }

  
  submitRequest() {
    this.confirming = true;
    this.errorMsg = undefined;
    const form: Models.LoginSubmit = {
      password: this.f.password.value,
      userName: this.f.userName.value
    };

    this.generalSvc.login(form).subscribe({
      next: result => {
        this.confirming = false;
        if (result.successful === false) {
          this.errorMsg = result.responseMessage;
          this.cdr.detectChanges();
        }
        else {
          this.authService.setSession(result.userId, result.userName);
          this.close();
        }
      },
      error: error => {
        this.confirming = false;
        this.errorMsg = "An error occurred while attempting to log in";
        this.cdr.detectChanges();
        console.error(error);
      }
    });
  }
  
}
*/
