import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoPlatformService } from '../crypto-platform.service';

@Component({
  selector: 'ns-create-crypto-platform-price',
  templateUrl: './create-crypto-platform-price.component.html',
  styleUrls: ['./create-crypto-platform-price.component.css']
})
export class CreateCryptoPlatformPriceComponent implements OnInit {
  platforms: Array<string> = ["bitstamp", "bitfinex"];
  selectedPlatform = "";
  symbolFrom = "";
  symbolTo = "";

  constructor(private readonly router: Router,
              private readonly platformService: CryptoPlatformService) { }

  ngOnInit(): void {
  }

  public onPlatformPriceCreate() {
    console.log("Create Price Pair: " + this.selectedPlatform + this.symbolFrom + this.symbolTo);
    this.platformService.addDisplayTradingPair(this.selectedPlatform, this.symbolFrom, this.symbolTo);
    this.router.navigate([ 'crypto-home' ]);
  }

  public onCancel() {
    this.initializeFields();
    this.router.navigate([ 'crypto-home' ]);
  }

  private initializeFields() {
    this.selectedPlatform = "";
    this.symbolFrom = "";
    this.symbolTo = "";
  }

  public onPlatformSelectionChanged(event) {
    this.selectedPlatform = event.value;
  }
}
