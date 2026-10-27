import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import * as Models from '../../../shared/models/models';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styles: [],
  standalone: false
})
export class CreateUserModalComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef); 
  confirming = false;
  model!: UntypedFormGroup;
  errorMsg?: string;

  @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;

  constructor(private fb: UntypedFormBuilder, private generalSvc: GeneralService){}

  ngOnInit() {
    this.model = this.fb.group({
      userName: [null, Validators.required],
      password: [null, Validators.required],
      email: [null, Validators.required]
    });
  }

  open() {
    this.dialog.nativeElement.showModal();
  }

  close() {
    this.errorMsg = undefined;
    this.dialog.nativeElement.close();
    this.model.reset(); // Optional: clears form fields when closing out
  }

  toggleConfirm() {
    this.confirming = true;
  }

  get f() { return this.model.controls; }

  getModelValidity() {
    return this.model.valid;
  }

  
  submitRequest() {
    this.confirming = true;
    this.errorMsg = undefined;
    const form: Models.NewUserSubmit = {
      email: this.f.email.value,
      password: this.f.password.value,
      userName: this.f.userName.value
    };

    this.generalSvc.createUser(form).subscribe({
      next: result => {
        this.confirming = false;
        if (result.successful === false) {
          this.errorMsg = result.responseMessage;
          this.cdr.detectChanges();
        }
        else {
          this.close();
        }
      },
      error: error => {
        this.confirming = false;
        this.errorMsg = "An error occurred while attempting to create the new user";
        this.cdr.detectChanges();
        console.error(error);
      }
    });
  }  
}
