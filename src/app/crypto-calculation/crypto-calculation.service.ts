import { Injectable, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { CryptoPortfolioService  } from '../crypto-portfolio/crypto-portfolio.service';
import { CryptoPlatformService } from '../crypto-platform/crypto-platform.service';
import { map } from 'rxjs/operators';
import { CryptoCalculationResult } from './CryptoCalculationResult';
import { CryptoPlatform } from '../crypto-platform/crypto-platform.enum';

@Injectable({
    providedIn: 'root'
})
export class CryptoCalculationService implements OnInit {

    public calculationResults$ = combineLatest([
        this.portfolioService.items$,
        this.platformService.tradingPairPrices$
    ]).pipe(
        map(([portfolioItems, tradingPrices]) => {
            const calculationResults: CryptoCalculationResult[] = [];
            for(let portfolioItem of portfolioItems) {
                const tradingPairPrice = tradingPrices.find((tradingPair) => {
                    return tradingPair.platform === portfolioItem.platform && portfolioItem.symbol === tradingPair.currencyCodeFrom && tradingPair.currencyCodeTo === 'eur';
                })
                calculationResults.push(new CryptoCalculationResult(portfolioItem.symbol + ' to EUR', portfolioItem, tradingPairPrice, portfolioItem.platform as CryptoPlatform, 'eur'));
            }

            return calculationResults;
        })
    )

    constructor(private readonly portfolioService: CryptoPortfolioService,
                private readonly platformService: CryptoPlatformService) { }

    ngOnInit() {
        
    }
}
