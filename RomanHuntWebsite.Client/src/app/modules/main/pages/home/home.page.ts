import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styles: [],
  standalone: false,
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('1000ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomePage implements OnInit, OnDestroy {
  loaded = false;

  images: string[] = [
    "assets/images/Space_A.webp",
    "assets/images/Space_B.webp",
    "assets/images/Space_C.webp",
  ];

  private cdr = inject(ChangeDetectorRef);


  currentIndex = 0;
  private timerSubscription!: Subscription;


  constructor() { }

  ngOnInit(): void {
    this.startSlideshow();
  }

  startSlideshow(): void {
    if (this.images.length > 0) {
      // Cycles images every 4 seconds
      this.timerSubscription = interval(4000).subscribe(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.cdr.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
