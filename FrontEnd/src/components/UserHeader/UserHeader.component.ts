import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-UserHeader',
  templateUrl: './UserHeader.component.html',
  styleUrls: ['./UserHeader.component.css'],
  imports: [RouterLink, RouterLinkActive]
})
export class UserHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
