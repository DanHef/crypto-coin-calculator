import { Component, OnInit, AfterViewInit} from "@angular/core";
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

import { Router, ActivatedRoute } from "@angular/router";
import { PageRoute } from "nativescript-angular/router";
import { BrowserPlatformLocation } from "@angular/platform-browser/src/browser/location/browser_platform_location";
import { CalculationResult } from "./CalculationResult";


@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit, AfterViewInit {
    private coinPortfolio: Array<CoinPortfolioItem> = [];

    private currencyPricesBitstamp: CurrencyPrice[] = [];
    private currencyPricesBitfinex: CurrencyPrice[] = [];

    calcResultOverall: number = 0;

    private calcResultGeneral = [];
    private calcResultsPortfolios = [];

    private secureStorage = new SecureStorage();

    private tabSelectedIndex: number = 0;
    private tabBarMargin: number = 50;
    private createButtonVisible: boolean = false;

    //AdMob for Android to be done
    //private androidBannerId: string = "ca-app-pub-XXXX/YYYY";
    //private androidInterstitialId: string = "ca-app-pub-KKKK/LLLL";
    private iosBannerId: string = "ca-app-pub-3704439085032082/3863903252";
    private iosInterstitialId: string = "ca-app-pub-3704439085032082/6212479394";


    constructor(private readonly itemService: ItemService,
                private readonly portfolioItemService: PortfolioItemService,
                private readonly router: Router,
                private readonly currencyPriceService: CurrencyPriceService,
                private readonly calculationService: CalculationService,
                private readonly pageRoute: PageRoute) {
    }
    
    ngOnInit(): void {
        //initialize buffers
        this.portfolioItemService.loadPortfolio();
        this.currencyPriceService.loadCurrencyPrices().then(function() {
            this.calculationService.loadCurrencyPrices();
            
            this.refreshPortfolio();
            //this method only refreshes the currency price data from the local storage => to have the actual prices refresh on the data has to be performed
            this.refreshMaintainedCurrencyPrices();
            this.refreshMaintainedCalculationResults();
    
            //read data from the respective platforms
            let promiseBitfinex = this.refreshBitfinexData();
            let promiseBitstamp = this.refreshBitstampData();
    
            Promise.all([promiseBitfinex, promiseBitstamp]).then(() => {
                this.calculateResults();
                this.refreshMaintainedCalculationResults();
            });
        }.bind(this));

        this.currencyPriceService.currencyPricesChanged.subscribe(function() {
            this.refreshMaintainedCurrencyPrices();
        }.bind(this));
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
        this.calculationService.calculateAllResults().then(function(calculationResults) {
            this.calcResultsPortfolios = calculationResults;
        }.bind(this));
    }
    //----------------------
    //END: data refresh logic
    //----------------------


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
   

    savePriceInformation() {
        this.currencyPriceService.saveCurrencyPrices();
    }

    createPressed() {
        switch(this.tabSelectedIndex) {
            case 0:
                //calculation field should be created
                this.router.navigate(["/createCalculationResult"]);
                break;
            case 1: 
                //portfolio item should be created
                this.router.navigate(["/createPortfolioItem"]);
                break;
            case 2: 
                //currency price should be created
                this.router.navigate(["/createCurrencyPrice"]); 
                break;
        }
    }

    calcResultDelete(calculationResult: CalculationResult) {
        this.calculationService.deleteCalculationResult(calculationResult);
        this.calculationService.saveCalculationResults();
    }


    portfolioItemDelete(portfolioItem: CoinPortfolioItem) {
        this.portfolioItemService.deletePortfolioItem(portfolioItem);
        this.portfolioItemService.savePortfolio();
    }

    currencyPriceDelete(currencyPrice: CurrencyPrice) {
        this.currencyPriceService.deleteCurrencyPrice(currencyPrice);
        this.currencyPriceService.saveCurrencyPrices();
    }


    onTabIndexChanged(event) {
        if(this.tabSelectedIndex === 0) {
            this.createButtonVisible = false;
        } else {
            this.createButtonVisible = true;
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
}