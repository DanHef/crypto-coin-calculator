import { Component, OnInit } from "@angular/core";
import { SecureStorage } from "nativescript-secure-storage";

import { CurrencyPrice } from './CurrencyPrice';
import { CoinPortfolioItem } from './CoinPortfolioItem';
import { ItemService } from "./item.service";

import * as Admob from "nativescript-admob";


@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    currencyPricesBitstamp: CurrencyPrice[] = [new CurrencyPrice("ltc", "eur", "bitstamp", "LTC/EUR"),
                                                new CurrencyPrice("btc", "eur", "bitstamp", "BTC/EUR"),
                                                new CurrencyPrice("xrp", "eur", "bitstamp", "XRP/EUR")];

    currencyPricesBitfinex: CurrencyPrice[] = [new CurrencyPrice("iot", "btc", "bitfinex", "IOTA/BTC"),
                                                new CurrencyPrice("btc", "eur", "bitfinex", "BTC/EUR"),
                                                new CurrencyPrice("eth", "usd", "bitfinex", "ETH/USD"),
                                                new CurrencyPrice("iot", "eth", "bitfinex", "IOTA/ETH"),
                                                new CurrencyPrice("btc", "usd", "bitfinex", "BTC/USD"),
                                                new CurrencyPrice("dsh", "usd", "bitfinex", "DSH/USD"),
                                                new CurrencyPrice("dsh", "btc", "bitfinex", "DSH/BTC")];

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

    coinPortfolio: Array<CoinPortfolioItem> = [];


    secureStorage = new SecureStorage();

    //private androidBannerId: string = "ca-app-pub-XXXX/YYYY";
    //private androidInterstitialId: string = "ca-app-pub-KKKK/LLLL";
    private iosBannerId: string = "ca-app-pub-3704439085032082/3863903252";
    private iosInterstitialId: string = "ca-app-pub-3704439085032082/6212479394";

    public createBanner() {
        Admob.createBanner({
            testing: true,
            size: Admob.AD_SIZE.SMART_BANNER,
            iosBannerId: this.iosBannerId,
            //androidBannerId: this.androidBannerId,
            iosTestDeviceIds: ["9FE3C4E8-C7DB-40EB-BCCD-84A43050EEAB"],
            margins: {
                bottom: 0
            }
        }).then(function() {
            console.log("admob createBanner done");
        }, function(error) {
            console.log("admob createBanner error: " + error);
        });
    }

    public createInterstitial() {
        Admob.createInterstitial({
            testing: true,
            iosInterstitialId: this.iosInterstitialId,
            //androidInterstitialId: this.androidInterstitialId,
            iosTestDeviceIds: ["9FE3C4E8-C7DB-40EB-BCCD-84A43050EEAB"]
        }).then(function() {
            console.log("admob createInterstitial done");
        }, function(error) {
            console.log("admob createInterstitial error: " + error);
        });
    }

    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.createBanner();
        this.initializePortfolio();
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

        for (var i = 0; i < this.currencyPricesBitstamp.length; i++) {
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

        for (var i = 0; i < this.currencyPricesBitfinex.length; i++) {
            let promise = this.itemService.loadDataFromBitfinexWithSymbol(this.currencyPricesBitfinex[i]);
            promises.push(promise);
        }

        return new Promise<boolean>((resolve, reject) => {
            Promise.all(promises).then(() => {
                this.calculateAll();
                resolve(true);
            });
        });
    }


    getCourse(from, to, platform): number {
        if (platform === "bitfinex") {
            for (var i = 0; i < this.currencyPricesBitfinex.length; i++) {
                if (this.currencyPricesBitfinex[i].currencyCodeFrom === from &&
                    this.currencyPricesBitfinex[i].currencyCodeTo === to) {
                    return this.currencyPricesBitfinex[i].price;
                }
            }
        } else if (platform === "bitstamp") {
            for (var i = 0; i < this.currencyPricesBitstamp.length; i++) {
                if (this.currencyPricesBitstamp[i].currencyCodeFrom === from &&
                    this.currencyPricesBitstamp[i].currencyCodeTo === to) {
                    return this.currencyPricesBitstamp[i].price;
                }
            }
        }
    }

    getQuantity(portfolioItem: CoinPortfolioItem): number {
        if (portfolioItem) {
            return portfolioItem.getQuantity();
        }
    }


    getCoinPortfolioItem(portfolioItemName: string, portfolio: string): CoinPortfolioItem {
        for (var i = 0; i < this.coinPortfolio.length; i++) {
            if (this.coinPortfolio[i].getPortfolioName() === portfolio
                && this.coinPortfolio[i].getPortfolioItemName() === portfolioItemName) {
                return this.coinPortfolio[i];
            }
        }

        return null;
    }


    createPortfolioItem(portfolioItemName: string, portfolioItemDescription: string, portfolio: string): CoinPortfolioItem {
        let portfolioItem = new CoinPortfolioItem();
        portfolioItem.setPortfolioName(portfolio);
        portfolioItem.setPortfolioItemName(portfolioItemName);
        portfolioItem.setPortfolioItemDescription(portfolioItemDescription);

        this.coinPortfolio.push(portfolioItem);

        return portfolioItem;
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
        let result = (this.getCoinPortfolioItem("bitfinexIOTA", "bitfinex").getQuantity() * this.getCourse("iot", "btc", "bitfinex")) * this.getCourse("btc", "eur", "bitfinex");
        this.CalcIOTAEuro = result.toString();
    }

    calculateDashEuroViaBTC() {
        let result = (this.getCoinPortfolioItem("bitfinexDash", "bitfinex").getQuantity() * this.getCourse("dsh", "btc", "bitfinex")) * this.getCourse("btc", "eur", "bitfinex");
        this.CalcDashEuroViaBTC = result.toString();
    }

    calculateDashUSD() {
        let result = this.getCoinPortfolioItem("bitfinexDash", "bitfinex").getQuantity() * this.getCourse("dsh", "usd", "bitfinex");
        this.CalcDashUSD = result.toString();
    }

    calculateBTCEuro() {
        let result = this.getCoinPortfolioItem("bitfinexBTC", "bitfinex").getQuantity() * this.getCourse("btc", "eur", "bitfinex");
        this.CalcBTCEuro = result.toString();
    }

    calculateBTCUSD() {
        let result = this.getCoinPortfolioItem("bitfinexBTC", "bitfinex").getQuantity() * this.getCourse("btc", "usd", "bitfinex");
        this.CalcBTCUSD = result.toString();
    }

    calculateIOTAUSDViaETH() {
        let result = (this.getCoinPortfolioItem("bitfinexIOTA", "bitfinex").getQuantity() * this.getCourse("iot", "eth", "bitfinex")) * this.getCourse("eth", "usd", "bitfinex");
        this.CalcIOTAUSDViaETH = result.toString();
    }

    calculateIOTAUSDViaBTC() {
        let result = (this.getCoinPortfolioItem("bitfinexIOTA", "bitfinex").getQuantity()* this.getCourse("iot", "btc", "bitfinex")) * this.getCourse("btc", "usd", "bitfinex");
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
        let result = this.getCoinPortfolioItem("bitfinexBTC", "bitfinex").getQuantity() / this.getCourse("iot", "btc", "bitfinex");
        this.CalcBTCIOTA = result.toString();
    }


    calculateAllBitstamp() {
        let quantity = this.getCoinPortfolioItem("bitstampEuro", "bitstamp").getQuantity();
        let result = quantity / this.getCourse("ltc", "eur", "bitstamp");
        this.CalcBitstampLTCAmountEUR = result.toString();

        quantity = this.getCoinPortfolioItem("bitstampEuro", "bitstamp").getQuantity();
        result = quantity / this.getCourse("btc", "eur", "bitstamp");
        this.CalcBitstampBTCAmountEuro = result.toString();

        quantity = this.getCoinPortfolioItem("bitstampEuro", "bitstamp").getQuantity();
        result = quantity / this.getCourse("xrp", "eur", "bitstamp");
        this.CalcBitstampXRPAmountEuro = result.toString();

        quantity = this.getCoinPortfolioItem("bitstampLitecoins", "bitstamp").getQuantity();
        result = quantity * this.getCourse("ltc", "eur", "bitstamp");
        this.CalcBitstampLTCEUR = result.toString();

        quantity = this.getCoinPortfolioItem("bitstampBTC", "bitstamp").getQuantity();
        result = quantity * this.getCourse("btc", "eur", "bitstamp");
        this.CalcBitstampBTCEUR = result.toString();

        quantity = this.getCoinPortfolioItem("bitstampRipples", "bitstamp").getQuantity();
        result = quantity * this.getCourse("xrp", "eur", "bitstamp");
        this.CalcBitstampXRPEUR = result.toString();

        result = parseFloat(this.CalcBitstampBTCEUR) + parseFloat(this.CalcBitstampLTCEUR) + parseFloat(this.CalcBitstampXRPEUR);
        this.CalcBitstampAllEuro = result.toString();
    }

    onRefreshPressed(event) {
        var pullToRefresh = event.object;

        this.refreshAll(pullToRefresh);
    }



    readSecureStorage() {
        /*var success = this.secureStorage.removeSync({
            key: "cryptoCoinCalcPortfolio"
        });*/

        let storedPortfolioString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPortfolio",
        });

        if (storedPortfolioString) {
            let storedPortfolio = JSON.parse(storedPortfolioString);
            for (var i = 0; i < storedPortfolio.length; i++) {
                let storedPortfolioItem = storedPortfolio[i];
                let portfolioItem = this.getCoinPortfolioItem(storedPortfolioItem.portfolioItemName,
                    storedPortfolioItem.portfolio);

                portfolioItem.setQuantity(storedPortfolioItem.quantity);
            }
        }
    }


    onPortfolioItemQuantityChange(quantity, portfolioItem) {
        portfolioItem.setQuantity(quantity);

        this.secureStorage.setSync({
            key: "cryptoCoinCalcPortfolio",
            value: JSON.stringify(this.coinPortfolio)
        });
    }


    initializePortfolio() {
        //create bitstamp portfolio items
        //bitstampLitecoins
        this.createPortfolioItem("bitstampLitecoins",
            "Bitstamp - Litecoins",
            "bitstamp");

        //bitstampEuro
        this.createPortfolioItem("bitstampEuro",
            "Bitstamp - Verfügbare Euro",
            "bitstamp");

        //bitstampBTC
        this.createPortfolioItem("bitstampBTC",
            "Bitstamp - Bitcoins",
            "bitstamp");


        //bitstampRipples
        this.createPortfolioItem("bitstampRipples",
            "Bitstamp - Ripples",
            "bitstamp");

        //create bitfinex portfolio items
        //bitfinexIOTA
        this.createPortfolioItem("bitfinexIOTA",
            "Bitfinex - IOTA",
            "bitfinex");

        //bitfinexBTC
        this.createPortfolioItem("bitfinexBTC",
            "Bitfinex - Bitcoins",
            "bitfinex");

        //bitfinexDash
        this.createPortfolioItem("bitfinexDash",
            "Bitfinex - Dash",
            "bitfinex");
    }
}