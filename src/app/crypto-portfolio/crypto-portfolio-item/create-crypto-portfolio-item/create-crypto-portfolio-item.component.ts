import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListPicker } from '@nativescript/core';
import { CryptoPortfolioService } from '../../crypto-portfolio.service';
import { ICryptoPortfolioItem } from '../crypto-portfolio-item';

@Component({
  selector: 'ns-create-crypto-portfolio-item',
  templateUrl: './create-crypto-portfolio-item.component.html',
  styleUrls: ['./create-crypto-portfolio-item.component.css']
})
export class CreateCryptoPortfolioItemComponent implements OnInit {
  platforms: Array<string> = ["Bitstamp", "Bitfinex"];
  selectedPlatform = "";
  technicalName = "";
  description = "";
  quantity = 0;

  showPlatformPicker = false;

  constructor(private readonly cryptoPortfolioService: CryptoPortfolioService,
              private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  public onPlatformSelectionChanged(event) {
    this.selectedPlatform = event.value;

  }

  public onPlatformSelect() {
    this.showPlatformPicker = true;
  }

  public confirmSelectedPlatform() {
    this.showPlatformPicker = false;
  }

  public onItemCreate() {
    this.cryptoPortfolioService.addCryptoPortfolioItem({
      id: 0,
      platform: this.selectedPlatform,
      description: this.description,
      name: this.technicalName,
      quantity: this.quantity,
      sortOrderNumber: 1,
      symbol: "BTS"
    } as ICryptoPortfolioItem);

    this.router.navigate([ 'crypto-home' ]);
  }

  public onCancel() {
    this.initializeFields();
    this.router.navigate([ 'crypto-home' ]);
  }

  private initializeFields() {
    this.selectedPlatform = "";
    this.description = "";
    this.technicalName = "";
    this.quantity = 0;
  }

}
