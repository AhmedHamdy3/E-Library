import { Component, OnInit } from '@angular/core';
import { UserHeaderComponent } from "../UserHeader/UserHeader.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-UserLayout',
  templateUrl: './UserLayout.component.html',
  styleUrls: ['./UserLayout.component.css'],
  imports: [UserHeaderComponent, RouterOutlet]
})
export class UserLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
