import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-NotFound',
  templateUrl: './NotFound.component.html',
  styleUrls: ['./NotFound.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(
        private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
  }
  goBack() {
    // Check if there's previous browser history
    if (window.history.length > 1) {
      console.log("s;dkf")
      this.location.back(); // Go back in browser history
    } else {
      this.router.navigate(['/']); // Fallback to home if no history
    }
  }
}
