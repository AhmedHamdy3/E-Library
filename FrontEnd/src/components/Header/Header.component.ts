import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/Shared.service';
@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private searchService: SharedService) { }

  ngOnInit() {
  }
  onSearch(event: Event) {
     const value = (event.target as HTMLInputElement).value;
    this.searchService.updateSearchTerm(value);
  }
}
