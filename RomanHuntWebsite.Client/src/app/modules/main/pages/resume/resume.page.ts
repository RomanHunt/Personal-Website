import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.page.html',
  styles: [],
  standalone: false
})
export class ResumePage implements OnInit {
  loaded = false;

  constructor() { }

  ngOnInit(): void {

  }
}
