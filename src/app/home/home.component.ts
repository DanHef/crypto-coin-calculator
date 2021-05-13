import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'crypto-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedIndex = 0;

  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }


  public createPressed() {
    switch (this.selectedIndex) {
      case 0:
        //this.router.navigate(['(crypto-portfolio:create-crypto-portfolio-item) '], { relativeTo: this.activatedRoute });
        this.router.navigate([{ outlets: { cryptoPortfolio: 'create-crypto-portfolio-item' } }], { relativeTo: this.activatedRoute });
        break;
      case 1:
        this.router.navigate([{ outlets: { 'crypto-platform': ['create-crypto-platform-price'] } }], { relativeTo: this.activatedRoute });
        break;
      case 2:

        break;

      default:
        break;
    }

  }

  onSelectedIndexChanged(event) {
    this.selectedIndex = event.newIndex;
  }

}
