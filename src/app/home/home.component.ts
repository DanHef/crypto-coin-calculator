import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'crypto-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }


  public createPressed() {
    this.router.navigate(['create-crypto-portfolio-item'], { relativeTo: this.activatedRoute });
  }

}
