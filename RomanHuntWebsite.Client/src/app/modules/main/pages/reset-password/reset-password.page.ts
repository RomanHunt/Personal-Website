import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import * as Models from '../../../../shared/models/models';
import { GeneralService } from '../../../../core/services/general.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styles: [],
  standalone: false
})
export class ResetPasswordPage implements OnInit {
  loaded = false;
  model!: UntypedFormGroup;
  token: string | null = null;
  confirming = false;
  responseMsg?: string;
  private cdr = inject(ChangeDetectorRef); 


  constructor(private route: ActivatedRoute, private fb: UntypedFormBuilder, private generalSvc: GeneralService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });

    this.model = this.fb.group({
      password: ['', Validators.required],
    });
  }

  get f() { return this.model.controls; }

  getModelValidity() {
    return this.model.valid;
  }

  submitRequest() {
    this.confirming = true;
    this.responseMsg = undefined;
    const form: Models.ChangePasswordSubmit = {
      password: this.f.password.value,
      token: this.token!
    };

    this.generalSvc.resetPassword(form).subscribe({
      next: result => {
        this.confirming = false;
        this.responseMsg = result.responseMessage;
        this.cdr.detectChanges();
      },
      error: error => {
        this.confirming = false;
        this.responseMsg = "An error occurred while attempting to reset the password";
        this.cdr.detectChanges();
        console.error(error);
      }
    });
  }  
}
