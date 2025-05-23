import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-Sidebar',
  templateUrl: './Sidebar.component.html',
  styleUrls: ['./Sidebar.component.css'],
  imports:[RouterLink, RouterLinkActive],
})
export class SidebarComponent implements OnInit {
  constructor() {
   }

  ngOnInit() {
  }

}
