import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {

  slideOpts = {
    speed: 400
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  continueToApp() {
    this.router.navigateByUrl('/app');
  }

}
