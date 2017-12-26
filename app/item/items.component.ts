import { Component, OnInit } from "@angular/core";
import { SecureStorage } from "nativescript-secure-storage";

import { CurrencyPrice } from './CurrencyPrice';
import { ItemService } from "./item.service";


@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    currencyPricesBitstamp: CurrencyPrice[] = [ new CurrencyPrice("ltc","eur", "bitstamp"),
                                                new CurrencyPrice("btc","eur", "bitstamp"),
                                                new CurrencyPrice("xrp","eur", "bitstamp")];

    currencyPricesBitfinex: CurrencyPrice[] = [ new CurrencyPrice("iot","btc", "bitfinex"),
                                                new CurrencyPrice("btc","eur", "bitfinex"),
                                                new CurrencyPrice("eth","usd", "bitfinex"),
                                                new CurrencyPrice("iot","eth", "bitfinex"),
                                                new CurrencyPrice("btc","usd", "bitfinex"),
                                                new CurrencyPrice("dsh","usd", "bitfinex"),
                                                new CurrencyPrice("dsh","btc", "bitfinex")];

    IOTABTCKurs: string;
    BTCEURKurs: string;
    BTCUSDKurs: string;
    IOTAETHKurs: string;
    ETHUSDKurs: string;
    DashBTCKurs: string;
    DashUSDKurs: string;
    BitstampBTCEURKurs: string;
    BitstampLTCEURKurs: string;
    BitstampXRPEURKurs: string;

    CalcIOTAEuro: string;
    CalcIOTAUSDViaETH: string;
    CalcIOTAUSDViaBTC: string;
    CalcDashEuroViaBTC: string;
    CalcDashUSD: string;
    CalcBTCEuro: string;
    CalcBTCUSD: string;
    CalcBTCIOTA: string;
    CalcAllEuroViaBTC: string;
    CalcAllUSDViaETH: string;
    CalcAllUSDViaBTC: string;

    CalcBitstampLTCAmountEUR: string;
    CalcBitstampBTCAmountEuro: string;
    CalcBitstampXRPAmountEuro: string;
    CalcBitstampLTCEUR: string;
    CalcBitstampBTCEUR: string;
    CalcBitstampXRPEUR: string;
    CalcBitstampAllEuro: string;

    IOTAAmount: string;
    BTCAmount: string;
    DashAmount: string;
    BitstampEuroAmount: string;
    BitstampLitecoinAmount: string;
    BitstampBitcoinAmount: string;
    BitstampRipplesAmount: string;

    secureStorage = new SecureStorage();

    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.readSecureStorage();
        this.refreshBitfinexData();
        this.refreshBitstampData();
    }

    refreshAll(pullToRefresh) {
        let promiseBitfinex = this.refreshBitfinexData();
        let promiseBitstamp = this.refreshBitstampData();

        Promise.all([promiseBitfinex, promiseBitstamp]).then(() => {
            pullToRefresh.refreshing = false;
        });
    }

    refreshBitstampData(): Promise<boolean> {
        var promises = [];

        for(var i=0; i<this.currencyPricesBitstamp.length; i++) {
            let promise = this.itemService.loadDataFromBitstampWithSymbol(this.currencyPricesBitstamp[i]);
            promises.push(promise);
        }

        return new Promise<boolean>((resolve, reject) => {
            Promise.all(promises).then(() => {
                this.calculateAll();
                resolve(true);
            });
        });
    }

    refreshBitfinexData(): Promise<boolean> {
        var promises = [];
        
        for(var i=0; i<this.currencyPricesBitfinex.length; i++) {
            let promise = this.itemService.loadDataFromBitfinexWithSymbol(this.currencyPricesBitfinex[i]);
            promises.push(promise);
        }

        return new Promise<boolean>((resolve, reject) => {
            Promise.all(promises).then(() => {
                this.calculateAll();
                resolve(true);
            });
        });


        /*let promiseIota = this.itemService.loadIotaBTCData().then((BTCKurs) => {
            this.IOTABTCKurs = BTCKurs;
        });

        let promiseBTCEuro = this.itemService.loadBTCEuroData().then((BTCEuroKurs) => {
            this.BTCEURKurs = BTCEuroKurs;
        });

        let promiseETHUSD = this.itemService.loadETHUSDData().then((ETHUSDKurs) => {
            this.ETHUSDKurs = ETHUSDKurs;
        });

        let promiseIotaETH = this.itemService.loadIOTAETHData().then((IOTAETHKurs) => {
            this.IOTAETHKurs = IOTAETHKurs;
        });

        let promiseBTCUSD = this.itemService.loadBTCUSDData().then((BTCUSDKurs) => {
            this.BTCUSDKurs = BTCUSDKurs;
        });

        let promiseDashUSD = this.itemService.loadDashUSDData().then((DashUSDKurs) => {
            this.DashUSDKurs = DashUSDKurs;
        });

        let promiseDashBTC = this.itemService.loadDashBTCData().then((DashBTCKurs) => {
            this.DashBTCKurs = DashBTCKurs;
        });*/
    }


    getCourse(from, to, platform): number {
        if(platform === "bitfinex") {
            for(var i=0; i<this.currencyPricesBitfinex.length; i++) {
                if(this.currencyPricesBitfinex[i].currencyCodeFrom === from &&
                    this.currencyPricesBitfinex[i].currencyCodeTo === to) {
                        return this.currencyPricesBitfinex[i].price;
                }
            }
        } else if(platform === "bitstamp") {
            for(var i=0; i<this.currencyPricesBitstamp.length; i++) {
                if(this.currencyPricesBitstamp[i].currencyCodeFrom === from &&
                    this.currencyPricesBitstamp[i].currencyCodeTo === to) {
                        return this.currencyPricesBitstamp[i].price;
                }
            }
        }
    }

    calculateAll() {
        this.calculateIOTAEuroViaBTC();
        this.calculateDashEuroViaBTC();
        this.calculateDashUSD();
        this.calculateBTCIOTA();
        this.calculateBTCEuro();
        this.calculateBTCUSD();
        this.calculateIOTAUSDViaBTC();
        this.calculateIOTAUSDViaETH();

        this.calculateAllEuroViaBTC();
        this.calculateAllUSDViaBTC();
        this.calculateAllUSDViaEthereum();

        this.calculateAllBitstamp();
    }

    calculateIOTAEuroViaBTC() {
        let result = (parseFloat(this.IOTAAmount) * this.getCourse("iot", "btc", "bitfinex")) * this.getCourse("btc", "eur", "bitfinex");
        this.CalcIOTAEuro = result.toString();
    }

    calculateDashEuroViaBTC() {
        let result = (parseFloat(this.DashAmount) * this.getCourse("dsh", "btc", "bitfinex")) * this.getCourse("btc", "eur", "bitfinex");
        this.CalcDashEuroViaBTC = result.toString();
    }

    calculateDashUSD() {
        let result = parseFloat(this.DashAmount) * this.getCourse("dsh", "usd", "bitfinex");
        this.CalcDashUSD = result.toString();
    }

    calculateBTCEuro() {
        let result = parseFloat(this.BTCAmount) * this.getCourse("btc", "eur", "bitfinex");
        this.CalcBTCEuro = result.toString();
    }

    calculateBTCUSD() {
        let result = parseFloat(this.BTCAmount) * this.getCourse("btc", "usd", "bitfinex");
        this.CalcBTCUSD = result.toString();
    }

    calculateIOTAUSDViaETH() {
        let result = (parseFloat(this.IOTAAmount) * this.getCourse("iot", "eth", "bitfinex")) * this.getCourse("eth", "usd", "bitfinex");
        this.CalcIOTAUSDViaETH = result.toString();
    }

    calculateIOTAUSDViaBTC() {
        let result = (parseFloat(this.IOTAAmount) * this.getCourse("iot", "btc", "bitfinex")) * this.getCourse("btc", "usd", "bitfinex");
         this.CalcIOTAUSDViaBTC = result.toString();
    }

    calculateAllEuroViaBTC() {
        let result = parseFloat(this.CalcBTCEuro) + parseFloat(this.CalcIOTAEuro) + parseFloat(this.CalcDashEuroViaBTC);
        this.CalcAllEuroViaBTC = result.toString();
    }

    calculateAllUSDViaEthereum() {
        let result = parseFloat(this.CalcIOTAUSDViaETH) + parseFloat(this.CalcBTCUSD) + parseFloat(this.CalcDashUSD);
        this.CalcAllUSDViaETH = result.toString();
    }

    calculateAllUSDViaBTC() {
        let result = parseFloat(this.CalcIOTAUSDViaBTC) + parseFloat(this.CalcBTCUSD) + parseFloat(this.CalcDashUSD);
        this.CalcAllUSDViaBTC = result.toString();
    }

    calculateBTCIOTA() {
        let result = parseFloat(this.BTCAmount) / this.getCourse("iot", "btc", "bitfinex");
        this.CalcBTCIOTA = result.toString();
    }


    calculateAllBitstamp() {
        let result = parseFloat(this.BitstampEuroAmount) / this.getCourse("ltc", "eur", "bitstamp");
        this.CalcBitstampLTCAmountEUR = result.toString();

        result = parseFloat(this.BitstampEuroAmount) / this.getCourse("btc", "eur", "bitstamp");
        this.CalcBitstampBTCAmountEuro = result.toString();

        result = parseFloat(this.BitstampEuroAmount) / this.getCourse("xrp", "eur", "bitstamp");
        this.CalcBitstampXRPAmountEuro = result.toString();

        result = parseFloat(this.BitstampLitecoinAmount) * this.getCourse("ltc", "eur", "bitstamp");
        this.CalcBitstampLTCEUR = result.toString();

        result = parseFloat(this.BitstampBitcoinAmount) * this.getCourse("btc", "eur", "bitstamp");
        this.CalcBitstampBTCEUR = result.toString();

        result = parseFloat(this.BitstampRipplesAmount) * this.getCourse("xrp", "eur", "bitstamp");
        this.CalcBitstampXRPEUR = result.toString();

        result = parseFloat(this.CalcBitstampBTCEUR) + parseFloat(this.CalcBitstampLTCEUR) + parseFloat(this.CalcBitstampXRPEUR);
        this.CalcBitstampAllEuro = result.toString();
    }

    onRefreshPressed(event) {
        var pullToRefresh = event.object;

        this.refreshAll(pullToRefresh);
    }



    readSecureStorage() {
        this.IOTAAmount = this.secureStorage.getSync({
            key: "bfCalcIOTAAmount"
        }) || "309";

        this.BTCAmount = this.secureStorage.getSync({
            key: "bfCalcBTCAmount"
        }) || "0.07297568";

        this.DashAmount = this.secureStorage.getSync({
            key: "bfCalcDashAmount"
        }) || "0.16300331";

        this.BitstampBitcoinAmount = this.secureStorage.getSync({
            key: "bsCalcBTCAmount"
        }) || "0";

        this.BitstampLitecoinAmount = this.secureStorage.getSync({
            key: "bsCalcLTCAmount"
        }) || "0";

        this.BitstampEuroAmount = this.secureStorage.getSync({
            key: "bsCalcEuroAmount"
        }) || "500";

        this.BitstampRipplesAmount = this.secureStorage.getSync({
            key: "bsCalcRipplesAmount"
        }) || "0";
    }

    onBitstampRipplesAmountChange(event) {
        this.BitstampRipplesAmount = event;
        this.secureStorage.setSync({
            key: "bsCalcRipplesAmount",
            value: this.BitstampRipplesAmount
        });
    }

    onBitstampEuroAmountChange(event) {
        this.BitstampEuroAmount = event;
        this.secureStorage.setSync({
            key: "bsCalcEuroAmount",
            value: this.BitstampEuroAmount
        });
    }

    onBitstampLitecoinAmountChange(event) {
        this.BitstampLitecoinAmount = event;
        this.secureStorage.setSync({
            key: "bsCalcLTCAmount",
            value: this.BitstampLitecoinAmount
        });
    }

    onBitstampBitcoinAmountChange(event) {
        this.BitstampBitcoinAmount = event;
        this.secureStorage.setSync({
            key: "bsCalcBTCAmount",
            value: this.BitstampBitcoinAmount
        });
    }

    onIOTAAmountChange(event) {
        this.IOTAAmount = event;
        this.secureStorage.setSync({
            key: "bfCalcIOTAAmount",
            value: this.IOTAAmount
        });
    }

    onBTCAmountChange(event) {
        this.BTCAmount = event;
        this.secureStorage.setSync({
            key: "bfCalcBTCAmount",
            value: this.BTCAmount
        });

    }

    onDashAmountChange(event) {
        this.DashAmount = event;
        this.secureStorage.setSync({
            key: "bfCalcDashAmount",
            value: this.DashAmount
        });
    }
}