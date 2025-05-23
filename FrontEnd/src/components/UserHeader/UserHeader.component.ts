import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/Auth.service';
@Component({
  selector: 'app-UserHeader',
  templateUrl: './UserHeader.component.html',
  styleUrls: ['./UserHeader.component.css'],
  imports: [RouterLink, RouterLinkActive]
})
export class UserHeaderComponent implements OnInit {
  username: string | null = localStorage.getItem("username")

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl("/")
  }
}
