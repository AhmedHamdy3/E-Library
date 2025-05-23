import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../components/Sidebar/Sidebar.component";
import { HeaderComponent } from "../components/Header/Header.component";
import { UserHeaderComponent } from "../components/UserHeader/UserHeader.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'E-Library';
}
