import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import * as Models from '../../../../shared/models/models';
import { GeneralService } from '../../../../core/services/general.service';
import { AuthService, UserSession } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styles: [],
  standalone: false
})
export class UserSettingsPage implements OnInit {
  loaded = false;
  model!: UntypedFormGroup;
  token: string | null = null;
  confirming = false;
  private cdr = inject(ChangeDetectorRef); 
  activeUserId: number;
  userSession$: UserSession;
  errorMsg: string | null = null;
  private router = inject(Router)
  userSettings: Models.UserSettings;

  constructor(private route: ActivatedRoute, private fb: UntypedFormBuilder, private generalSvc: GeneralService,
    private authSvc: AuthService) {
    this.userSession$ = authSvc.currentUserValue;
  }

  ngOnInit(): void {
    this.activeUserId = Number(this.userSession$.userId);

    if (!this.activeUserId) {
      this.router.navigate(['/home']);
    }
    else {
      this.loadUserSettings();
    }
  }

  loadUserSettings() {
    this.errorMsg = null;
    this.generalSvc.getUserSettings(this.activeUserId).subscribe({
      next: result => {
        this.model = this.fb.group({
          userName: [result.name, Validators.required],
        });

        this.userSettings = result;

        if (!this.loaded) {
          this.loaded = true;
        }

        this.cdr.detectChanges();
      },
      error: error => {
        this.confirming = false;
        this.errorMsg = "An error occurred while attempting to load the user settings";
        this.cdr.detectChanges();
        console.error(error);
      }
    });
  }

  get f() { return this.model.controls; }

  getModelValidity() {
    return this.model.valid;
  }

  submitRequest() {
    this.errorMsg = null;
    this.confirming = true;
    const form: Models.UserSettingsSubmit = {
      name: this.f.userName.value,
      userId: this.activeUserId
    };

    this.generalSvc.saveUserSettings(form).subscribe({
      next: result => {
        this.confirming = false;
        this.errorMsg = result.errorMessage;
        this.cdr.detectChanges();
      },
      error: error => {
        this.confirming = false;
        this.errorMsg = "An error occurred while attempting to save the user settings";
        this.cdr.detectChanges();
        console.error(error);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.errorMsg = null;
    if (file) {
      this.generalSvc.uploadAvatar(this.activeUserId, file).subscribe({
        next: (response) => {
          this.loadUserSettings(); // Reload the settings to grab the new image string
        },
        error: (err) => {
          this.errorMsg = "Upload failed. Please ensure you selected a valid image."
          console.error(err);
        }
      });
    }

  }

}
