import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../Sidebar/Sidebar.component";
import { HeaderComponent } from "../Header/Header.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-AdminLayout',
  templateUrl: './AdminLayout.component.html',
  styleUrls: ['./AdminLayout.component.css'],
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
  providers: []
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
