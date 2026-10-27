import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import * as Models from '../../../shared/models/models';
import { AuthService, UserSession } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styles: [],
  standalone: false
})
export class LoginModalComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef); 
  confirming = false;
  model!: UntypedFormGroup;
  errorMsg?: string;
  emailMsg?: string;
  emailModel!: UntypedFormGroup;

  @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;

  constructor(private fb: UntypedFormBuilder, private generalSvc: GeneralService, private authService: AuthService){}

  ngOnInit() {
    this.model = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.emailModel = this.fb.group({
      email: [null, Validators.required]
    });
  }

  open() {
    this.dialog.nativeElement.showModal();
  }

  close() {
    this.errorMsg = undefined;
    this.emailMsg = undefined;
    this.dialog.nativeElement.close();
    this.model.reset(); // Optional: clears form fields when closing out
    this.emailModel.reset();
  }

  toggleConfirm() {
    this.confirming = true;
  }

  get f() { return this.model.controls; }

  get ef() { return this.emailModel.controls; }


  getModelValidity() {
    return this.model.valid;
  }

  forgotUserName() {
    const form: Models.AccountEmailSubmit =
    {
      email: this.ef.email.value,
      forgotPassword: false
    };

    this.sendEmail(form);
  }

  forgotPassword() {
    const form: Models.AccountEmailSubmit =
    {
      email: this.ef.email.value,
      forgotPassword: true
    };
    this.sendEmail(form);
  }

  sendEmail(form: Models.AccountEmailSubmit) {
    this.emailMsg = undefined;
    this.generalSvc.sendUserEmail(form).subscribe({
      next: result => {
        this.emailMsg = result.responseMessage;
        this.cdr.detectChanges();
      },
      error: error => {
        this.emailMsg = "An error occurred while attempting to send an email";
        this.cdr.detectChanges();
        console.error(error);
      }
    });
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
          window.location.reload();
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
