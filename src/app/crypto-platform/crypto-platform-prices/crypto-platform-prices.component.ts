import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { CryptoPlatformService } from '../crypto-platform.service';

@Component({
  selector: 'ns-crypto-platform-prices',
  templateUrl: './crypto-platform-prices.component.html',
  styleUrls: ['./crypto-platform-prices.component.css']
})
export class CryptoPlatformPricesComponent implements OnInit {

  tradingPairPrices$ = this.cryptoPlatformService.tradingPairPrices$.pipe(
    //filter all non visible price combinations
    map((tradingPairPrices) => tradingPairPrices.filter((price) => price.display === true))
  );

  constructor(private readonly cryptoPlatformService: CryptoPlatformService) { }

  ngOnInit(): void {
  }

}
