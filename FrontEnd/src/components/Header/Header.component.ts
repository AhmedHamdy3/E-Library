import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/Shared.service';
import { AuthService } from '../../services/Auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string | null = localStorage.getItem("username")
  constructor(private searchService: SharedService, private authService:AuthService, private router: Router) { }
  
  ngOnInit() {
  }
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.updateSearchTerm(value);
  }
  logout(){
    this.authService.logout();
    this.router.navigateByUrl("/")
  }
}
