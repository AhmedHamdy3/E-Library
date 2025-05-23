import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/Shared.service';
import { AuthService } from '../../services/Auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-GuestHeader',
  templateUrl: './GuestHeader.component.html',
  styleUrls: ['./GuestHeader.component.css'],
  imports: [RouterLink, RouterLinkActive]
})
export class GuestHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  register() {
    this.router.navigateByUrl("register")
  }
  login() {
    this.router.navigateByUrl("login")

  }

}
