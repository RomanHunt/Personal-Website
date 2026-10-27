import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject , HostListener} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import * as Models from '../../../shared/models/models';
import { AuthService, UserSession } from '../../services/auth.service';
import { QuillEditorComponent } from 'ngx-quill';


@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styles: [],
  standalone: false
})
export class ChatModalComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef); 
  confirming = false;
  model!: UntypedFormGroup;
  errorMsg?: string;
  chat: Models.GetChatReturn;
  userId: number;
  editingMessageId?: number;
  opened: boolean;
  avatarMappings = new Map<number, string>();
  currentPage = 0;
  messages: Models.ChatMessage[] = [];
  totalMessages: number;
  pageSize = 3;
  mobileBreakpoint = 768; 
  isMobile: boolean;

  @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('myEditor', { static: false }) editorComponent!: QuillEditorComponent;
  @ViewChild('mobileEditor', { static: false }) mobileEditorComponent!: QuillEditorComponent;


  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],        // toggled buttons
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']                               // remove formatting button
    ],
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    }
  };

  constructor(private fb: UntypedFormBuilder, private generalSvc: GeneralService, private authService: AuthService){}

  ngOnInit() {
    this.model = this.fb.group({
      message: ['', Validators.required],
    }); 
  }

  open(chat: Models.GetChatReturn, userId: number, users: Models.UserSummary[]) {
    this.chat = chat;
    this.userId = userId;

    users.forEach(o => {
      if (o.avatar) {
        this.avatarMappings.set(o.userId, o.avatar);
      }
    });

    this.messages = chat.messages;
    this.totalMessages = chat.totalMessages;
    this.checkScreenSize();
    this.opened = true;
    this.dialog.nativeElement.showModal();
    this.cdr.detectChanges();

    setTimeout(() => {
      if (this.editorComponent?.quillEditor)
      {
        this.editorComponent.quillEditor.focus();
      }
      if (this.mobileEditorComponent?.quillEditor) {
        this.mobileEditorComponent.quillEditor.focus();
      }     

    }, 50);
  }

  close() {
    this.errorMsg = undefined;
    this.editingMessageId = undefined;
    this.opened = false;
    this.dialog.nativeElement.close();
    this.cdr.detectChanges();
    this.model.reset(); // Optional: clears form fields when closing out
  }

  toggleConfirm() {
    this.confirming = true;
  }

  changePage(pageNumber: number) {
    if (!this.editingMessageId) {
      this.confirming = true;
      const submit: Models.GetChatSubmit = {
        chatId: this.chat.id,
        userId: this.userId,
        pageNumber: pageNumber
      };

      this.generalSvc.getChat(submit).subscribe({
        next: result => {
          this.confirming = false;
          this.messages = result.messages;
          this.currentPage = pageNumber;
          this.cdr.detectChanges();
        },
        error: error => {
          this.confirming = false;
          this.errorMsg = "An error occurred while attempting to change the chat page";
          this.cdr.detectChanges();
          console.error(error);
        }
      });
    }
  }



  get f() { return this.model.controls; }

  getModelValidity() {
    return this.model.valid;
  }

  editMessage(messageId: number) {
    this.model.reset();
    const match = this.chat.messages.find(o => o.id === messageId && o.userId === this.userId);
    this.f.message.setValue(match?.text);
    this.editingMessageId = messageId;
  }

  cancelEdit() {
    this.editingMessageId = undefined;
    this.model.reset();
  }

  submitRequest() {
    this.confirming = true;
    this.errorMsg = undefined;
    const form: Models.CreateChatMessageSubmit = {
      chatId: this.chat.id,
      userId: this.userId,
      chatMessageText: this.f.message.value,
      chatMessageId: this.editingMessageId ?? 0,
      pageNumber: this.maxPage
    };

    this.generalSvc.createMessage(form).subscribe({
      next: result => {
        this.confirming = false;
        this.chat = result;
        this.messages = result.messages;
        this.editingMessageId = undefined;
        this.totalMessages = result.totalMessages;
        this.model.reset()
        this.cdr.detectChanges();

        if (this.maxPage > this.currentPage) {
          this.changePage(this.maxPage);
        }

      },
      error: error => {
        this.confirming = false;
        this.errorMsg = "An error occurred while attempting to create the message";
        this.cdr.detectChanges();
        console.error(error);
      }
    });
  }

  onEditorFocus(event: any) {
    // Manually force Quill to re-read current formatting attributes
    // when focus shifts from lines or buttons.
    const quill = event.editor;
    if (quill) {
      const selection = quill.getSelection();
      if (selection) {
        quill.setSelection(selection.index, selection.length);
      }
    }
  }

  onSelection(event: any) {
    // Keeps selection details localized within the modal context
    if (event.range === null) {
      // Prevents total formatting wipeout on modal layout changes
      event.editor.focus();
    }
  }

  focusEditor(quillInstance: any) {
    if (quillInstance) {
      quillInstance.focus();
    }
  }

  // Listen to the window resize event programmatically
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= this.mobileBreakpoint;
  }

  get maxPage(): number {
    return Math.ceil(this.totalMessages / this.pageSize) - 1;
  }
}
