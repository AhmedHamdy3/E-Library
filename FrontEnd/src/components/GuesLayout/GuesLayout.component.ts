import { Component, OnInit } from '@angular/core';
import { GuestHeaderComponent } from "../GuestHeader/GuestHeader.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-GuesLayout',
  templateUrl: './GuesLayout.component.html',
  styleUrls: ['./GuesLayout.component.css'],
  imports: [GuestHeaderComponent, RouterOutlet]
})
export class GuesLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
