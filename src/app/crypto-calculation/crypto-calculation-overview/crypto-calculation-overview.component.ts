import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { CryptoPlatform } from '../../crypto-platform/crypto-platform.enum';
import { CryptoCalculationService } from '../crypto-calculation.service';

@Component({
    selector: 'ns-crypto-calculation-overview',
    templateUrl: './crypto-calculation-overview.component.html',
    styleUrls: ['./crypto-calculation-overview.component.css']
})
export class CryptoCalculationOverviewComponent implements OnInit {
    public bitstampSum = 0;
    public bitfinexSum = 0;
    public sum = 0;

    calculationResults$ = [];/* this.calculationService.calculationResults$.pipe(
        tap((calculationResults) => {
            for(let calculationResult of calculationResults) {
                const result = calculationResult.getResult();
                if(calculationResult.platform === CryptoPlatform.Bitfinex) {
                    this.bitfinexSum = result + this.bitfinexSum;
                } else if (calculationResult.platform === CryptoPlatform.Bitstamp) {
                    this.bitstampSum = result + this.bitstampSum;
                }
    
                this.sum = this.sum + result;
            }
        })
    );*/

    constructor(private readonly calculationService: CryptoCalculationService) { }

    ngOnInit(): void {
    }

}
