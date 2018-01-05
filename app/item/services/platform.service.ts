import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { CurrencyPrice } from "../CurrencyPrice";

@Injectable()
export class PlatformService {
    constructor(private readonly http: Http) {}

    //bitstamp symbols
    //https://www.bitstamp.net/api/v2/trading-pairs-info/
    public readAllBitstampSymbols(): Promise<CurrencyPrice[]> {
        return new Promise((resolve, reject) => {
            this.http.get("https://www.bitstamp.net/api/v2/trading-pairs-info/").subscribe((result) => {
                let bitstampSymbols = result.json();
                let bitstampCurrencyPrices: Array<CurrencyPrice> = [];

                for(var i=0; i<bitstampSymbols.length; i++) {
                    let bitstampSymbol = bitstampSymbols[i];
                    bitstampCurrencyPrices.push(this.createCurrencyPriceFromSymbol(bitstampSymbol.url_symbol, "bitstamp"));
                }

                resolve(bitstampCurrencyPrices);
            });
        });
    }


    //bitfinex symbols
    //https://api.bitfinex.com/v1/symbols
    public readAllBitfinexSymbols(): Promise<CurrencyPrice[]> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/symbols").subscribe((result) => {
                let symbols = result.json();
                let bitfinexCurrencyPrices: Array<CurrencyPrice> = [];

                for(var i=0; i<symbols.length; i++) {
                    let bitfinexSymbol = symbols[i];
                    bitfinexCurrencyPrices.push(this.createCurrencyPriceFromSymbol(bitfinexSymbol, "bitfinex"));
                }

                resolve(bitfinexCurrencyPrices);
            });
        });
    }

    private createCurrencyPriceFromSymbol(symbolPair: string, platform: string) {
        let sourceSymbol = symbolPair.slice(0,2);
        let targetSymbol = symbolPair.slice(3,5);

        return new CurrencyPrice(sourceSymbol, targetSymbol, platform);
    }

}