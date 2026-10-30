import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../../../core/services/general.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.page.html',
  styles: [],
  standalone: false
})
export class ActivateAccountPage implements OnInit {
  loaded = false;
  token: string | null = null;
  confirming = false;
  responseMsg?: string;
  private cdr = inject(ChangeDetectorRef); 


  constructor(private route: ActivatedRoute, private generalSvc: GeneralService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');

      if (this.token) {
        this.generalSvc.activateAccount(this.token!).subscribe({
          next: result => {
            this.confirming = false;
            this.responseMsg = result.responseMessage;
            this.cdr.detectChanges();
          },
          error: error => {
            this.confirming = false;
            this.responseMsg = "An error occurred while attempting to activate the account";
            this.cdr.detectChanges();
            console.error(error);
          }
        });
      }
      else {
        this.responseMsg = "Missing token";
      }
    });
  }
}
