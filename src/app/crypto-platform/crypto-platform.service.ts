import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, scan, shareReplay, tap } from 'rxjs/operators';
import { combineLatest, forkJoin, from, merge, Observable, of, Subject } from 'rxjs';
import { SecureStorage } from '@nativescript/secure-storage';
import { CryptoPlatform } from './crypto-platform.enum';
import { CryptoPortfolioService } from '../crypto-portfolio/crypto-portfolio.service';
import { ICryptoPortfolioItem } from '../crypto-portfolio/crypto-portfolio-item/crypto-portfolio-item';

export interface CurrencyTradingPairPrice {
    platform?: string;
    description?: string;
    currencyCodeFrom?: string;
    currencyCodeTo?: string;
    price?: number;
    symbol?: string;
    display?: boolean;
    direct?: boolean;
}

enum CrudOperation {
    Deleted = 1,
    Added = 2,
    Changed = 3,
}


interface CrudCurrencyTradingPairPrice extends CurrencyTradingPairPrice {
    operation: CrudOperation
}


interface BitstampTradingPairs {
    base_decimals: number;
    minimum_order: string;
    name: string;
    counter_decimals: number;
    trading: string;
    url_symbol: string;
    description: string;
}

interface BitstampCurrentPrices {
    high: string;
    last: string;
    timestamp: string;
    bid: string;
    vwap: string;
    volume: string;
    low: string;
    ask: string;
    open: string;
}

interface BitfinexCurrentPrices {
    mid: string;
    bid: string;
    ask: string;
    last_price: string;
    low: string;
    high: string;
    volume: string;
    timestamp: string;
}

const STORAGE_KEY_DISPLAY_PRICES = 'cryptoPlatformDisplayPrices';

@Injectable({
    providedIn: 'root'
})
export class CryptoPlatformService {
    private storage = new SecureStorage();

    private displayPricesFromStorage$ = from(this.storage.get({ key: STORAGE_KEY_DISPLAY_PRICES })).pipe(
        map(storedDisplayPricesString => JSON.parse(storedDisplayPricesString)),
        map(storedDisplayPricesJSON => storedDisplayPricesJSON && storedDisplayPricesJSON.displayPrices ? storedDisplayPricesJSON.displayPrices as CurrencyTradingPairPrice[] : []),
        shareReplay(1)
    );

    private bitstampTradingPairs$ = this.http.get<BitstampTradingPairs[]>("https://www.bitstamp.net/api/v2/trading-pairs-info/").pipe(
        map((tradingPairs) => tradingPairs.filter((tradingPair) => tradingPair.trading === 'Enabled')),
        map((tradingPairs) => tradingPairs.map((tradingPair) => {
            return tradingPair.url_symbol;
        }))
    );

    private bitfinexTradingPairs$ = this.http.get<string[]>("https://api.bitfinex.com/v1/symbols");


    private tradingPairPriceCrudSubject = new Subject<CrudCurrencyTradingPairPrice>();
    public tradingPairPriceCrudAction$ = this.tradingPairPriceCrudSubject.asObservable();


    private tradingPairs$ = combineLatest([
        this.bitstampTradingPairs$,
        this.bitfinexTradingPairs$
    ]).pipe(
        map(([bitstampTradingPairStrings, bitfinexTradingPairStrings]) => {
            const tradingPairPrices: CurrencyTradingPairPrice[] = [];

            for (let tradingPairString of bitstampTradingPairStrings) {
                tradingPairPrices.push({
                    currencyCodeFrom: this.extractCurrencyCodeFrom(tradingPairString),
                    currencyCodeTo: this.extractCurrencyCodeTo(tradingPairString),
                    symbol: tradingPairString,
                    platform: CryptoPlatform.Bitstamp,
                    direct: true
                });
            }

            for (let tradingPairString of bitfinexTradingPairStrings) {
                tradingPairPrices.push({
                    currencyCodeFrom: this.extractCurrencyCodeFrom(tradingPairString),
                    currencyCodeTo: this.extractCurrencyCodeTo(tradingPairString),
                    symbol: tradingPairString,
                    platform: CryptoPlatform.Bitfinex,
                    direct: true
                });
            }

            return tradingPairPrices;
        })
    );

    private tradingPairsMixinDisplay$ = combineLatest([
        this.tradingPairs$,
        this.displayPricesFromStorage$
    ]).pipe(
        map(([tradingPairs, displayPricesFromStorage]) => {
            for (let displayPrice of displayPricesFromStorage) {
                if (this.checkTradingPairExists(tradingPairs, displayPrice)) {
                    tradingPairs = tradingPairs.map((tradingPair) => {
                        if (displayPrice.platform === tradingPair.platform && displayPrice.currencyCodeFrom === tradingPair.currencyCodeFrom && displayPrice.currencyCodeTo === tradingPair.currencyCodeTo) {
                            //just adjust display option of existing trading pair
                            return { ...tradingPair, display: true };
                        } else {
                            return tradingPair;
                        }
                    });
                } else {
                    tradingPairs = [...tradingPairs, { ...displayPrice, display: true }];
                }
            }

            return tradingPairs;
        }),
        shareReplay(1)
    );

    private tradingPairPricesMixinPortfolio$ = combineLatest([
        this.tradingPairsMixinDisplay$,
        this.portfolioService.items$
    ]).pipe(
        tap(() => console.log("Mixin Portfolio Items")),
        map(([tradingPairs, portfolioItems]) => {
            for (let portfolioItem of portfolioItems) {
                const tradingPairFromPortfolioItem = {
                    platform: portfolioItem.platform,
                    currencyCodeFrom: portfolioItem.currencyCode,
                    currencyCodeTo: 'eur',
                    description: portfolioItem.name + ' to EUR',
                } as CurrencyTradingPairPrice;

                if (this.checkTradingPairExists(tradingPairs, tradingPairFromPortfolioItem)) {
                    tradingPairs = tradingPairs.map((tradingPair) => {
                        if (tradingPairFromPortfolioItem.platform === tradingPair.platform && tradingPairFromPortfolioItem.currencyCodeFrom === tradingPair.currencyCodeFrom && tradingPairFromPortfolioItem.currencyCodeTo === tradingPair.currencyCodeTo) {
                            //just adjust display option of existing trading pair
                            return { ...tradingPair, display: true };
                        } else {
                            return tradingPair;
                        }
                    });
                } else {
                    tradingPairs = [...tradingPairs, { ...tradingPairFromPortfolioItem, display: true }];
                }
            }

            return tradingPairs;
        }),
        shareReplay(1)
    );


    public tradingPairPrices$ = merge(
        this.tradingPairPricesMixinPortfolio$,
        this.tradingPairPriceCrudAction$
    ).pipe(
        scan((tradingPairs: CurrencyTradingPairPrice[], crudTradingPair: CrudCurrencyTradingPairPrice) => this.handleCRUDOperations(tradingPairs, crudTradingPair)),
        shareReplay(1),
        tap((tradingPairs) => {
            /*const displayTradingPairs = tradingPairs.filter((tradingPair) => tradingPair.display === true);
            console.log("Saving Items: " + JSON.stringify(displayTradingPairs));
            this.storage.set({
                key: STORAGE_KEY_DISPLAY_PRICES,
                value: JSON.stringify({
                    "displayPrices": displayTradingPairs
                })
            });*/
        }),
        mergeMap((tradingPairs) => {
            const observables: Observable<CurrencyTradingPairPrice>[] = [];
            for (let i = 0; i < tradingPairs.length; i++) {
                if (tradingPairs[i].display === true) {
                    observables.push(this.addLatestPrice(tradingPairs[i]));
                } else {
                    observables.push(of(tradingPairs[i]));
                }
            }

            return forkJoin(observables);
        })
    );

    constructor(private readonly http: HttpClient,
        private readonly portfolioService: CryptoPortfolioService) { }

    public addDisplayTradingPair(platform: string, symbolFrom: string, symbolTo: string) {
        this.tradingPairPriceCrudSubject.next({
            platform,
            currencyCodeFrom: symbolFrom,
            currencyCodeTo: symbolTo,
            operation: CrudOperation.Added
        });
    }

    private handleCRUDOperations(tradingPairs: CurrencyTradingPairPrice[], crudTradingPair: CrudCurrencyTradingPairPrice) {
        if (!Array.isArray(crudTradingPair)) {
            switch (crudTradingPair.operation) {
                case CrudOperation.Added:
                    if (this.checkTradingPairExists(tradingPairs, crudTradingPair)) {
                        return tradingPairs.map((tradingPair) => {
                            if (crudTradingPair.platform === tradingPair.platform && crudTradingPair.currencyCodeFrom === tradingPair.currencyCodeFrom && crudTradingPair.currencyCodeTo === tradingPair.currencyCodeTo) {
                                //just adjust display option of existing trading pair
                                return { ...tradingPair, display: true };
                            } else {
                                return tradingPair;
                            }
                        });
                    } else {
                        return [...tradingPairs, { ...crudTradingPair, display: true }];
                    }

                case CrudOperation.Changed:
                    return tradingPairs.map((tradingPair) => {
                        if (this.checkTradingPairExists(tradingPairs, tradingPair)) {
                            return { ...tradingPair, display: true };
                        } else {
                            return {
                                ...crudTradingPair,
                                display: true
                            } as CurrencyTradingPairPrice;
                        }
                    });
                case CrudOperation.Deleted:
                    return tradingPairs.map((tradingPair) => {
                        if (this.checkTradingPairExists(tradingPairs, tradingPair)) {
                            return { ...tradingPair, display: false };
                        } else {
                            return tradingPair;
                        }
                    });
                default:
                    break;
            }
        }

        return tradingPairs;
    }

    private checkTradingPairExists(tradingPairs: CurrencyTradingPairPrice[], checkTradingPair: CurrencyTradingPairPrice) {
        return !!tradingPairs.find((tradingPair) => {
            return (tradingPair.platform === checkTradingPair.platform &&
                tradingPair.currencyCodeFrom === checkTradingPair.currencyCodeFrom &&
                tradingPair.currencyCodeTo === checkTradingPair.currencyCodeTo);
        });
    }

    private addLatestPrice(tradingPairPrice: CurrencyTradingPairPrice): Observable<CurrencyTradingPairPrice> {
        if (tradingPairPrice.platform === CryptoPlatform.Bitfinex) {

            return this.http.get<BitfinexCurrentPrices>("https://api.bitfinex.com/v1/pubticker/").pipe(
                map((currentPriceResponse) => ({ ...tradingPairPrice, price: +currentPriceResponse.last_price } as CurrencyTradingPairPrice))
            );
        } else if (tradingPairPrice.platform === CryptoPlatform.Bitstamp) {
            if (!tradingPairPrice.symbol) {
                tradingPairPrice.symbol = tradingPairPrice.currencyCodeFrom + tradingPairPrice.currencyCodeTo;
            }

            return this.http.get<BitstampCurrentPrices>("https://www.bitstamp.net/api/v2/ticker/" + tradingPairPrice.symbol).pipe(
                map((currentPriceResponse) => ({ ...tradingPairPrice, price: +currentPriceResponse.last } as CurrencyTradingPairPrice))
            );
        } else {
            // error
        }
    }


    private extractCurrencyCodeFrom(tradingPairSymbol: string) {
        return tradingPairSymbol.substr(0, 3);
    }

    private extractCurrencyCodeTo(tradingPairSymbol: string) {
        return tradingPairSymbol.substr(3, 3);
    }
}
