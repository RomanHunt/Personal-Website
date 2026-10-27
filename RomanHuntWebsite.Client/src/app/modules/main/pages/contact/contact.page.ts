import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styles: [],
  standalone: false
})
export class ContactPage implements OnInit {
  loaded = false;

  constructor() { }

  ngOnInit(): void {

  }
}
