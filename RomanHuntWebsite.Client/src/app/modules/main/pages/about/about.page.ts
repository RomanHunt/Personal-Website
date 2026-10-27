import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styles: [],
  standalone: false
})
export class AboutPage implements OnInit {
  loaded = false;

  constructor() { }

  ngOnInit(): void {

  }
}
