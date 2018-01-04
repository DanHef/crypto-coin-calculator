import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { SecureStorage } from "nativescript-secure-storage";

import { CurrencyPrice } from './CurrencyPrice';
import { CoinPortfolioItem } from './CoinPortfolioItem';
import { ItemService } from "./item.service";
import { PortfolioItemService } from "./services/portfolio-item.service";
import { CurrencyPriceService } from "./services/currency-price.service";
import { CalculationService } from "./services/calculation.service";

import * as Admob from "nativescript-admob";
import * as timer from "timer";
import * as platformModule from "tns-core-modules/platform";

import { Router } from "@angular/router";

//import * as configSettings from "../config.json";


@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit, AfterViewInit {
    private coinPortfolio: Array<CoinPortfolioItem> = [];

    private currencyPricesBitstamp: CurrencyPrice[] = [];
    private currencyPricesBitfinex: CurrencyPrice[] = [];

    private calcResultGeneral = [];
    private calcResultsPortfolios = [];

    private secureStorage = new SecureStorage();

    private tabSelectedIndex: number = 0;
    private tabBarMargin: number = 50;
    //AdMob for Android to be done
    //private androidBannerId: string = "ca-app-pub-XXXX/YYYY";
    //private androidInterstitialId: string = "ca-app-pub-KKKK/LLLL";
    private iosBannerId: string = "ca-app-pub-3704439085032082/3863903252";
    private iosInterstitialId: string = "ca-app-pub-3704439085032082/6212479394";
    

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


    constructor(private readonly itemService: ItemService,
                private readonly portfolioItemService: PortfolioItemService,
                private readonly router: Router,
                private readonly currencyPriceService: CurrencyPriceService,
                private readonly calculationService: CalculationService) {
    }
    
    ngOnInit(): void {
        //initialize buffers
        this.portfolioItemService.loadPortfolio();
        this.currencyPriceService.loadCurrencyPrices();

        this.refreshPortfolio();
        //this method only refreshes the currency price data from the local storage => to have the actual prices refresh on the data has to be performed
        this.refreshMaintainedCurrencyPrices();

        //read data from the respective platforms
        let promiseBitfinex = this.refreshBitfinexData();
        let promiseBitstamp = this.refreshBitstampData();

        Promise.all([promiseBitfinex, promiseBitstamp]).then(() => {
            this.calculateResults();
        });
    }

    ngAfterViewInit() {
        //this.createInterstitial();
        //this.createBanner();
    }

    //------------------------
    // data refresh logic
    //------------------------
    onRefreshTriggered(event) {
        var pullToRefresh = event.object;

        this.refreshAll(pullToRefresh);
    }

    refreshAll(pullToRefresh) {
        this.refreshPortfolio();
        this.refreshMaintainedCurrencyPrices();

        let promiseBitfinex = this.refreshBitfinexData();
        let promiseBitstamp = this.refreshBitstampData();

        Promise.all([promiseBitfinex, promiseBitstamp]).then(() => {
            this.calculateResults();
            pullToRefresh.refreshing = false;
        });
    }

    refreshBitstampData(): Promise<boolean> {
        var promises = [];
        let currencyPrices = this.currencyPriceService.getAllCurrencyPrices("bitstamp");

        for (var i = 0; i < currencyPrices.length; i++) {
            let promise = this.itemService.loadDataFromBitstampWithSymbol(currencyPrices[i]);
            promises.push(promise);
        }

        return new Promise<boolean>((resolve, reject) => {
            Promise.all(promises).then(() => {
                resolve(true);
            });
        });
    }

    refreshBitfinexData(): Promise<boolean> {
        var promises = [];
        let currencyPrices = this.currencyPriceService.getAllCurrencyPrices("bitfinex");

        for (var i = 0; i < currencyPrices.length; i++) {
            let promise = this.itemService.loadDataFromBitfinexWithSymbol(currencyPrices[i]);
            promises.push(promise);
        }

        return new Promise<boolean>((resolve, reject) => {
            Promise.all(promises).then(() => {
                resolve(true);
            });
        });
    }


    refreshPortfolio() {
        this.coinPortfolio = this.portfolioItemService.getAllPortfolioItems();
    }

    refreshMaintainedCurrencyPrices() {
        this.currencyPricesBitfinex = this.currencyPriceService.getAllCurrencyPrices("bitfinex");
        this.currencyPricesBitstamp = this.currencyPriceService.getAllCurrencyPrices("bitstamp");
    }

    refreshMaintainedCalculationResults() {
        this.calcResultsPortfolios = this.calculationService.getAllCalculationResults();
    }

    calculateResults() {
        this.calculationService.calculateAllResults();
        this.calcResultsPortfolios = this.calculationService.getAllCalculationResults();
    }
    //----------------------
    //END: data refresh logic
    //----------------------


    getCourse(from, to, platform): number {
        return this.currencyPriceService.getCurrencyPriceAmount(from, to, platform);
    }

    getQuantity(portfolioItem: CoinPortfolioItem): number {
        if (portfolioItem) {
            return portfolioItem.getQuantity();
        }
    }


    getCoinPortfolioItem(portfolioItemName: string, portfolio: string): CoinPortfolioItem {
        return this.portfolioItemService.getPortfolioItemByTechnicalName(portfolioItemName, portfolio);
    }


    createPortfolioItem(portfolioItemName: string, portfolioItemDescription: string, portfolio: string, symbol: string): CoinPortfolioItem {
        return this.portfolioItemService.createPortfolioItem(portfolioItemName, portfolioItemDescription, 0, portfolio, symbol);
    }

    onPortfolioItemQuantityChange(quantity, portfolioItem) {
        let changedPortfolioItem = this.portfolioItemService.getPortfolioItemByTechnicalName(portfolioItem.portfolioItemName,portfolioItem.portfolioName);
        changedPortfolioItem.setQuantity(quantity);

        this.portfolioItemService.savePortfolio();
        this.currencyPriceService.saveCurrencyPrices();
    }


    /*initializePortfolio() {
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
    }*/


    /*initializePrices() {
        this.createPriceInformation("ltc", "eur", "bitstamp", "LTC/EUR");
        this.createPriceInformation("btc", "eur", "bitstamp", "BTC/EUR");
        this.createPriceInformation("xrp", "eur", "bitstamp", "XRP/EUR");

        this.createPriceInformation("iot", "btc", "bitfinex", "IOTA/BTC");
        this.createPriceInformation("btc", "eur", "bitfinex", "BTC/EUR");
        this.createPriceInformation("eth", "usd", "bitfinex", "ETH/USD");
        this.createPriceInformation("iot", "eth", "bitfinex", "IOTA/ETH");
        this.createPriceInformation("btc", "usd", "bitfinex", "BTC/USD");
        this.createPriceInformation("dsh", "usd", "bitfinex", "DSH/USD");
        this.createPriceInformation("dsh", "btc", "bitfinex", "DSH/BTC");

        this.savePriceInformation();
    }*/


    /*createPriceInformation(from: string, to: string, description: string, platform: string): CurrencyPrice {
        return this.currencyPriceService.createCurrencyPrice(from, to, description, platform);
    }*/

    savePriceInformation() {
        this.currencyPriceService.saveCurrencyPrices();
    }

    createPressed() {
        switch(this.tabSelectedIndex) {
            case 0:
                //calculation field should be created
                this.router.navigate(["/createCalculationResult"]);
                break;
            case 2: 
                //portfolio item should be created
                this.router.navigate(["/createPortfolioItem"]);
                break;
            case 3: 
                //currency price should be created   
                this.router.navigate(["/createCurrencyPrice"]); 
                break;
        }
    }


    //---------------------
    // AdMob functions
    //---------------------
    public createBanner() {
        //different margin for iPhone X because of the bigger screen
        if (platformModule.screen.mainScreen.heightPixels === 2436 &&
            platformModule.device.deviceType === "Phone") {
            this.tabBarMargin = 50;
        }
        timer.setTimeout(function () {
            Admob.createBanner({
                testing: false,
                //testing: true,
                size: Admob.AD_SIZE.SMART_BANNER,
                iosBannerId: this.iosBannerId,
                //androidBannerId: this.androidBannerId,
                iosTestDeviceIds: ["9FE3C4E8-C7DB-40EB-BCCD-84A43050EEAB", "dee881b78c67c6420ac3cb41add46a94"],
                margins: {
                    bottom: 0
                }
            }).then(function () {
                console.log("admob createBanner done");
            }, function (error) {
                console.log("admob createBanner error: " + error);
            });
        }.bind(this), 0);
    }

    public createInterstitial() {
        timer.setTimeout(function () {
            Admob.createInterstitial({
                testing: true,
                iosInterstitialId: this.iosInterstitialId,
                //androidInterstitialId: this.androidInterstitialId,
                iosTestDeviceIds: ["9FE3C4E8-C7DB-40EB-BCCD-84A43050EEAB", "dee881b78c67c6420ac3cb41add46a94"]
            }).then(function () {
                console.log("admob createInterstitial done");
            }, function (error) {
                console.log("admob createInterstitial error: " + error);
            });
        }.bind(this), 0);
    }


    //calculations
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
        let result = (this.getCoinPortfolioItem("bitfinexIOTA", "bitfinex").getQuantity() * this.getCourse("iot", "btc", "bitfinex")) * this.getCourse("btc", "usd", "bitfinex");
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
}