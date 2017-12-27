import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { CurrencyPrice } from './CurrencyPrice';

@Injectable()
export class ItemService {
    constructor(private readonly http: Http) { }

    loadDataFromBitfinexWithSymbol(currencyPrice: CurrencyPrice): Promise<CurrencyPrice> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/pubticker/" + currencyPrice.getSymbol()).subscribe((result) => {
                currencyPrice.setPrice(result.json().last_price)
                resolve(currencyPrice);
            });
        });
    }

    /*loadDataFromBitfinex(from: string, to: string): Promise<CurrencyPrice> {
        return this.loadDataFromBitfinexWithSymbol(new CurrencyPrice(from, to, "bitstamp"));
    }*/

    loadDataFromBitstampWithSymbol(currencyPrice: CurrencyPrice): Promise<CurrencyPrice> {
        return new Promise((resolve, reject) => {
            this.http.get("https://www.bitstamp.net/api/v2/ticker/" + currencyPrice.getSymbol()).subscribe((result) => {
                currencyPrice.setPrice(result.json().last)
                resolve(currencyPrice);
            });
        });
    }

    /*loadDataFromBitstamp(from: string, to: string): Promise<CurrencyPrice> {
        return this.loadDataFromBitstampWithSymbol(new CurrencyPrice(from,to, "bitfinex"));
    }*/

    loadIotaBTCData(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/pubticker/iotbtc").subscribe((result) => {
                let data = result.json();
                resolve(data.last_price);
            });
        });
    }


    loadBTCEuroData(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/pubticker/btceur").subscribe((result) => {
                let data = result.json();
                resolve(data.last_price);
            });
        });
    }

    loadETHUSDData(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/pubticker/ethusd").subscribe((result) => {
                let data = result.json();
                resolve(data.last_price);
            });
        });
    }


    loadIOTAETHData(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/pubticker/ioteth").subscribe((result) => {
                let data = result.json();
                resolve(data.last_price);
            });
        });
    }

    loadBTCUSDData(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/pubticker/btcusd").subscribe((result) => {
                let data = result.json();
                resolve(data.last_price);
            });
        });
    }

    loadDashUSDData(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/pubticker/dshusd").subscribe((result) => {
                let data = result.json();
                resolve(data.last_price);
            });
        });
    }


    loadDashBTCData(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.http.get("https://api.bitfinex.com/v1/pubticker/dshbtc").subscribe((result) => {
                let data = result.json();
                resolve(data.last_price);
            });
        });
    }
}
