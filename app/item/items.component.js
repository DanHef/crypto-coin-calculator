"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var item_service_1 = require("./item.service");
var portfolio_item_service_1 = require("./services/portfolio-item.service");
var currency_price_service_1 = require("./services/currency-price.service");
var calculation_service_1 = require("./services/calculation.service");
var Admob = require("nativescript-admob");
var timer = require("timer");
var platformModule = require("tns-core-modules/platform");
var router_1 = require("@angular/router");
//import * as configSettings from "../config.json";
var ItemsComponent = (function () {
    /*CalcIOTAEuro: string;
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
    CalcBitstampAllEuro: string;*/
    function ItemsComponent(itemService, portfolioItemService, router, currencyPriceService, calculationService) {
        this.itemService = itemService;
        this.portfolioItemService = portfolioItemService;
        this.router = router;
        this.currencyPriceService = currencyPriceService;
        this.calculationService = calculationService;
        this.coinPortfolio = [];
        this.currencyPricesBitstamp = [];
        this.currencyPricesBitfinex = [];
        this.calcResultGeneral = [];
        this.calcResultsPortfolios = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
        this.tabSelectedIndex = 0;
        this.tabBarMargin = 50;
        this.createButtonVisible = false;
        //AdMob for Android to be done
        //private androidBannerId: string = "ca-app-pub-XXXX/YYYY";
        //private androidInterstitialId: string = "ca-app-pub-KKKK/LLLL";
        this.iosBannerId = "ca-app-pub-3704439085032082/3863903252";
        this.iosInterstitialId = "ca-app-pub-3704439085032082/6212479394";
    }
    ItemsComponent.prototype.ngOnInit = function () {
        var _this = this;
        //initialize buffers
        this.portfolioItemService.loadPortfolio();
        this.currencyPriceService.loadCurrencyPrices();
        this.refreshPortfolio();
        //this method only refreshes the currency price data from the local storage => to have the actual prices refresh on the data has to be performed
        this.refreshMaintainedCurrencyPrices();
        //read data from the respective platforms
        var promiseBitfinex = this.refreshBitfinexData();
        var promiseBitstamp = this.refreshBitstampData();
        Promise.all([promiseBitfinex, promiseBitstamp]).then(function () {
            _this.calculateResults();
        });
    };
    ItemsComponent.prototype.ngAfterViewInit = function () {
        //this.createInterstitial();
        //this.createBanner();
    };
    //------------------------
    // data refresh logic
    //------------------------
    ItemsComponent.prototype.onRefreshTriggered = function (event) {
        var pullToRefresh = event.object;
        this.refreshAll(pullToRefresh);
    };
    ItemsComponent.prototype.refreshAll = function (pullToRefresh) {
        var _this = this;
        this.refreshPortfolio();
        this.refreshMaintainedCurrencyPrices();
        var promiseBitfinex = this.refreshBitfinexData();
        var promiseBitstamp = this.refreshBitstampData();
        Promise.all([promiseBitfinex, promiseBitstamp]).then(function () {
            _this.calculateResults();
            pullToRefresh.refreshing = false;
        });
    };
    ItemsComponent.prototype.refreshBitstampData = function () {
        var promises = [];
        var currencyPrices = this.currencyPriceService.getAllCurrencyPrices("bitstamp");
        for (var i = 0; i < currencyPrices.length; i++) {
            var promise = this.itemService.loadDataFromBitstampWithSymbol(currencyPrices[i]);
            promises.push(promise);
        }
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function () {
                resolve(true);
            });
        });
    };
    ItemsComponent.prototype.refreshBitfinexData = function () {
        var promises = [];
        var currencyPrices = this.currencyPriceService.getAllCurrencyPrices("bitfinex");
        for (var i = 0; i < currencyPrices.length; i++) {
            var promise = this.itemService.loadDataFromBitfinexWithSymbol(currencyPrices[i]);
            promises.push(promise);
        }
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function () {
                resolve(true);
            });
        });
    };
    ItemsComponent.prototype.refreshPortfolio = function () {
        this.coinPortfolio = this.portfolioItemService.getAllPortfolioItems();
    };
    ItemsComponent.prototype.refreshMaintainedCurrencyPrices = function () {
        this.currencyPricesBitfinex = this.currencyPriceService.getAllCurrencyPrices("bitfinex");
        this.currencyPricesBitstamp = this.currencyPriceService.getAllCurrencyPrices("bitstamp");
    };
    ItemsComponent.prototype.refreshMaintainedCalculationResults = function () {
        this.calcResultsPortfolios = this.calculationService.getAllCalculationResults();
    };
    ItemsComponent.prototype.calculateResults = function () {
        this.calculationService.calculateAllResults();
        this.calcResultsPortfolios = this.calculationService.getAllCalculationResults();
    };
    //----------------------
    //END: data refresh logic
    //----------------------
    ItemsComponent.prototype.getCourse = function (from, to, platform) {
        return this.currencyPriceService.getCurrencyPriceAmount(from, to, platform);
    };
    ItemsComponent.prototype.getQuantity = function (portfolioItem) {
        if (portfolioItem) {
            return portfolioItem.getQuantity();
        }
    };
    ItemsComponent.prototype.getCoinPortfolioItem = function (portfolioItemName, portfolio) {
        return this.portfolioItemService.getPortfolioItemByTechnicalName(portfolioItemName, portfolio);
    };
    ItemsComponent.prototype.createPortfolioItem = function (portfolioItemName, portfolioItemDescription, portfolio, symbol) {
        return this.portfolioItemService.createPortfolioItem(portfolioItemName, portfolioItemDescription, 0, portfolio, symbol);
    };
    ItemsComponent.prototype.onPortfolioItemQuantityChange = function (quantity, portfolioItem) {
        var changedPortfolioItem = this.portfolioItemService.getPortfolioItemByTechnicalName(portfolioItem.portfolioItemName, portfolioItem.portfolioName);
        changedPortfolioItem.setQuantity(quantity);
        this.portfolioItemService.savePortfolio();
        this.currencyPriceService.saveCurrencyPrices();
    };
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
    ItemsComponent.prototype.savePriceInformation = function () {
        this.currencyPriceService.saveCurrencyPrices();
    };
    ItemsComponent.prototype.createPressed = function () {
        switch (this.tabSelectedIndex) {
            case 1:
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
    };
    ItemsComponent.prototype.onTabIndexChanged = function (event) {
        if (this.tabSelectedIndex === 0) {
            this.createButtonVisible = false;
        }
        else {
            this.createButtonVisible = true;
        }
    };
    //---------------------
    // AdMob functions
    //---------------------
    ItemsComponent.prototype.createBanner = function () {
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
    };
    ItemsComponent.prototype.createInterstitial = function () {
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
    };
    ItemsComponent = __decorate([
        core_1.Component({
            selector: "ns-items",
            moduleId: module.id,
            templateUrl: "./items.component.html",
        }),
        __metadata("design:paramtypes", [item_service_1.ItemService,
            portfolio_item_service_1.PortfolioItemService,
            router_1.Router,
            currency_price_service_1.CurrencyPriceService,
            calculation_service_1.CalculationService])
    ], ItemsComponent);
    return ItemsComponent;
}());
exports.ItemsComponent = ItemsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdFO0FBQ2hFLDJFQUE0RDtBQUk1RCwrQ0FBNkM7QUFDN0MsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUN6RSxzRUFBb0U7QUFFcEUsMENBQTRDO0FBQzVDLDZCQUErQjtBQUMvQiwwREFBNEQ7QUFFNUQsMENBQXlEO0FBR3pELG1EQUFtRDtBQVFuRDtJQXNCSTs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tDQWtCOEI7SUFHOUIsd0JBQTZCLFdBQXdCLEVBQ3hCLG9CQUEwQyxFQUMxQyxNQUFjLEVBQ2Qsb0JBQTBDLEVBQzFDLGtCQUFzQztRQUp0QyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUE5QzNELGtCQUFhLEdBQTZCLEVBQUUsQ0FBQztRQUU3QywyQkFBc0IsR0FBb0IsRUFBRSxDQUFDO1FBQzdDLDJCQUFzQixHQUFvQixFQUFFLENBQUM7UUFFN0Msc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLDBCQUFxQixHQUFHLEVBQUUsQ0FBQztRQUUzQixrQkFBYSxHQUFHLElBQUksMkNBQWEsRUFBRSxDQUFDO1FBRXBDLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUMxQix3QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFFN0MsOEJBQThCO1FBQzlCLDJEQUEyRDtRQUMzRCxpRUFBaUU7UUFDekQsZ0JBQVcsR0FBVyx3Q0FBd0MsQ0FBQztRQUMvRCxzQkFBaUIsR0FBVyx3Q0FBd0MsQ0FBQztJQTZCN0UsQ0FBQztJQUVELGlDQUFRLEdBQVI7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QyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQXpUUSxjQUFjO1FBTDFCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHdCQUF3QjtTQUN4QyxDQUFDO3lDQTRDNEMsMEJBQVc7WUFDRiw2Q0FBb0I7WUFDbEMsZUFBTTtZQUNRLDZDQUFvQjtZQUN0Qix3Q0FBa0I7T0EvQzFELGNBQWMsQ0FtYTFCO0lBQUQscUJBQUM7Q0FBQSxBQW5hRCxJQW1hQztBQW5hWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBBZnRlclZpZXdJbml0fSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgU2VjdXJlU3RvcmFnZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc2VjdXJlLXN0b3JhZ2VcIjtcblxuaW1wb3J0IHsgQ3VycmVuY3lQcmljZSB9IGZyb20gJy4vQ3VycmVuY3lQcmljZSc7XG5pbXBvcnQgeyBDb2luUG9ydGZvbGlvSXRlbSB9IGZyb20gJy4vQ29pblBvcnRmb2xpb0l0ZW0nO1xuaW1wb3J0IHsgSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvcG9ydGZvbGlvLWl0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgQ3VycmVuY3lQcmljZVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDYWxjdWxhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9jYWxjdWxhdGlvbi5zZXJ2aWNlXCI7XG5cbmltcG9ydCAqIGFzIEFkbW9iIGZyb20gXCJuYXRpdmVzY3JpcHQtYWRtb2JcIjtcbmltcG9ydCAqIGFzIHRpbWVyIGZyb20gXCJ0aW1lclwiO1xuaW1wb3J0ICogYXMgcGxhdGZvcm1Nb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm1cIjtcblxuaW1wb3J0IHsgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IEJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uIH0gZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2Jyb3dzZXIvbG9jYXRpb24vYnJvd3Nlcl9wbGF0Zm9ybV9sb2NhdGlvblwiO1xuXG4vL2ltcG9ydCAqIGFzIGNvbmZpZ1NldHRpbmdzIGZyb20gXCIuLi9jb25maWcuanNvblwiO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWl0ZW1zXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2l0ZW1zLmNvbXBvbmVudC5odG1sXCIsXG59KVxuZXhwb3J0IGNsYXNzIEl0ZW1zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgICBwcml2YXRlIGNvaW5Qb3J0Zm9saW86IEFycmF5PENvaW5Qb3J0Zm9saW9JdGVtPiA9IFtdO1xuXG4gICAgcHJpdmF0ZSBjdXJyZW5jeVByaWNlc0JpdHN0YW1wOiBDdXJyZW5jeVByaWNlW10gPSBbXTtcbiAgICBwcml2YXRlIGN1cnJlbmN5UHJpY2VzQml0ZmluZXg6IEN1cnJlbmN5UHJpY2VbXSA9IFtdO1xuXG4gICAgcHJpdmF0ZSBjYWxjUmVzdWx0R2VuZXJhbCA9IFtdO1xuICAgIHByaXZhdGUgY2FsY1Jlc3VsdHNQb3J0Zm9saW9zID0gW107XG5cbiAgICBwcml2YXRlIHNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuXG4gICAgcHJpdmF0ZSB0YWJTZWxlY3RlZEluZGV4OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgdGFiQmFyTWFyZ2luOiBudW1iZXIgPSA1MDtcbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvblZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8vQWRNb2IgZm9yIEFuZHJvaWQgdG8gYmUgZG9uZVxuICAgIC8vcHJpdmF0ZSBhbmRyb2lkQmFubmVySWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi1YWFhYL1lZWVlcIjtcbiAgICAvL3ByaXZhdGUgYW5kcm9pZEludGVyc3RpdGlhbElkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItS0tLSy9MTExMXCI7XG4gICAgcHJpdmF0ZSBpb3NCYW5uZXJJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLTM3MDQ0MzkwODUwMzIwODIvMzg2MzkwMzI1MlwiO1xuICAgIHByaXZhdGUgaW9zSW50ZXJzdGl0aWFsSWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi0zNzA0NDM5MDg1MDMyMDgyLzYyMTI0NzkzOTRcIjtcbiAgICBcblxuICAgIC8qQ2FsY0lPVEFFdXJvOiBzdHJpbmc7XG4gICAgQ2FsY0lPVEFVU0RWaWFFVEg6IHN0cmluZztcbiAgICBDYWxjSU9UQVVTRFZpYUJUQzogc3RyaW5nO1xuICAgIENhbGNEYXNoRXVyb1ZpYUJUQzogc3RyaW5nO1xuICAgIENhbGNEYXNoVVNEOiBzdHJpbmc7XG4gICAgQ2FsY0JUQ0V1cm86IHN0cmluZztcbiAgICBDYWxjQlRDVVNEOiBzdHJpbmc7XG4gICAgQ2FsY0JUQ0lPVEE6IHN0cmluZztcbiAgICBDYWxjQWxsRXVyb1ZpYUJUQzogc3RyaW5nO1xuICAgIENhbGNBbGxVU0RWaWFFVEg6IHN0cmluZztcbiAgICBDYWxjQWxsVVNEVmlhQlRDOiBzdHJpbmc7XG5cbiAgICBDYWxjQml0c3RhbXBMVENBbW91bnRFVVI6IHN0cmluZztcbiAgICBDYWxjQml0c3RhbXBCVENBbW91bnRFdXJvOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wWFJQQW1vdW50RXVybzogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcExUQ0VVUjogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcEJUQ0VVUjogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcFhSUEVVUjogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcEFsbEV1cm86IHN0cmluZzsqL1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGl0ZW1TZXJ2aWNlOiBJdGVtU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHBvcnRmb2xpb0l0ZW1TZXJ2aWNlOiBQb3J0Zm9saW9JdGVtU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY3VycmVuY3lQcmljZVNlcnZpY2U6IEN1cnJlbmN5UHJpY2VTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY2FsY3VsYXRpb25TZXJ2aWNlOiBDYWxjdWxhdGlvblNlcnZpY2UpIHtcbiAgICB9XG4gICAgXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vaW5pdGlhbGl6ZSBidWZmZXJzXG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UubG9hZFBvcnRmb2xpbygpO1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmxvYWRDdXJyZW5jeVByaWNlcygpO1xuXG4gICAgICAgIHRoaXMucmVmcmVzaFBvcnRmb2xpbygpO1xuICAgICAgICAvL3RoaXMgbWV0aG9kIG9ubHkgcmVmcmVzaGVzIHRoZSBjdXJyZW5jeSBwcmljZSBkYXRhIGZyb20gdGhlIGxvY2FsIHN0b3JhZ2UgPT4gdG8gaGF2ZSB0aGUgYWN0dWFsIHByaWNlcyByZWZyZXNoIG9uIHRoZSBkYXRhIGhhcyB0byBiZSBwZXJmb3JtZWRcbiAgICAgICAgdGhpcy5yZWZyZXNoTWFpbnRhaW5lZEN1cnJlbmN5UHJpY2VzKCk7XG5cbiAgICAgICAgLy9yZWFkIGRhdGEgZnJvbSB0aGUgcmVzcGVjdGl2ZSBwbGF0Zm9ybXNcbiAgICAgICAgbGV0IHByb21pc2VCaXRmaW5leCA9IHRoaXMucmVmcmVzaEJpdGZpbmV4RGF0YSgpO1xuICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5yZWZyZXNoQml0c3RhbXBEYXRhKCk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwoW3Byb21pc2VCaXRmaW5leCwgcHJvbWlzZUJpdHN0YW1wXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlc3VsdHMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICAvL3RoaXMuY3JlYXRlSW50ZXJzdGl0aWFsKCk7XG4gICAgICAgIC8vdGhpcy5jcmVhdGVCYW5uZXIoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRhdGEgcmVmcmVzaCBsb2dpY1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgb25SZWZyZXNoVHJpZ2dlcmVkKGV2ZW50KSB7XG4gICAgICAgIHZhciBwdWxsVG9SZWZyZXNoID0gZXZlbnQub2JqZWN0O1xuXG4gICAgICAgIHRoaXMucmVmcmVzaEFsbChwdWxsVG9SZWZyZXNoKTtcbiAgICB9XG5cbiAgICByZWZyZXNoQWxsKHB1bGxUb1JlZnJlc2gpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoUG9ydGZvbGlvKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpO1xuXG4gICAgICAgIGxldCBwcm9taXNlQml0ZmluZXggPSB0aGlzLnJlZnJlc2hCaXRmaW5leERhdGEoKTtcbiAgICAgICAgbGV0IHByb21pc2VCaXRzdGFtcCA9IHRoaXMucmVmcmVzaEJpdHN0YW1wRGF0YSgpO1xuXG4gICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVSZXN1bHRzKCk7XG4gICAgICAgICAgICBwdWxsVG9SZWZyZXNoLnJlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdHN0YW1wRGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0c3RhbXBXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdGZpbmV4RGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRmaW5leFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0ZmluZXhXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICByZWZyZXNoUG9ydGZvbGlvKCkge1xuICAgICAgICB0aGlzLmNvaW5Qb3J0Zm9saW8gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldEFsbFBvcnRmb2xpb0l0ZW1zKCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0JpdGZpbmV4ID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQml0c3RhbXAgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0c3RhbXBcIik7XG4gICAgfVxuXG4gICAgcmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKSB7XG4gICAgICAgIHRoaXMuY2FsY1Jlc3VsdHNQb3J0Zm9saW9zID0gdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuZ2V0QWxsQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVzdWx0cygpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuY2FsY3VsYXRlQWxsUmVzdWx0cygpO1xuICAgICAgICB0aGlzLmNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IHRoaXMuY2FsY3VsYXRpb25TZXJ2aWNlLmdldEFsbENhbGN1bGF0aW9uUmVzdWx0cygpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL0VORDogZGF0YSByZWZyZXNoIGxvZ2ljXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgIGdldENvdXJzZShmcm9tLCB0bywgcGxhdGZvcm0pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRDdXJyZW5jeVByaWNlQW1vdW50KGZyb20sIHRvLCBwbGF0Zm9ybSk7XG4gICAgfVxuXG4gICAgZ2V0UXVhbnRpdHkocG9ydGZvbGlvSXRlbTogQ29pblBvcnRmb2xpb0l0ZW0pOiBudW1iZXIge1xuICAgICAgICBpZiAocG9ydGZvbGlvSXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHBvcnRmb2xpb0l0ZW0uZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0Q29pblBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcpOiBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUocG9ydGZvbGlvSXRlbU5hbWUsIHBvcnRmb2xpbyk7XG4gICAgfVxuXG5cbiAgICBjcmVhdGVQb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lOiBzdHJpbmcsIHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjogc3RyaW5nLCBwb3J0Zm9saW86IHN0cmluZywgc3ltYm9sOiBzdHJpbmcpOiBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmNyZWF0ZVBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbU5hbWUsIHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbiwgMCwgcG9ydGZvbGlvLCBzeW1ib2wpO1xuICAgIH1cblxuICAgIG9uUG9ydGZvbGlvSXRlbVF1YW50aXR5Q2hhbmdlKHF1YW50aXR5LCBwb3J0Zm9saW9JdGVtKSB7XG4gICAgICAgIGxldCBjaGFuZ2VkUG9ydGZvbGlvSXRlbSA9IHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZ2V0UG9ydGZvbGlvSXRlbUJ5VGVjaG5pY2FsTmFtZShwb3J0Zm9saW9JdGVtLnBvcnRmb2xpb0l0ZW1OYW1lLHBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvTmFtZSk7XG4gICAgICAgIGNoYW5nZWRQb3J0Zm9saW9JdGVtLnNldFF1YW50aXR5KHF1YW50aXR5KTtcblxuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLnNhdmVQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cblxuICAgIC8qaW5pdGlhbGl6ZVBvcnRmb2xpbygpIHtcbiAgICAgICAgLy9jcmVhdGUgYml0c3RhbXAgcG9ydGZvbGlvIGl0ZW1zXG4gICAgICAgIC8vYml0c3RhbXBMaXRlY29pbnNcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBMaXRlY29pbnNcIixcbiAgICAgICAgICAgIFwiQml0c3RhbXAgLSBMaXRlY29pbnNcIixcbiAgICAgICAgICAgIFwiYml0c3RhbXBcIik7XG5cbiAgICAgICAgLy9iaXRzdGFtcEV1cm9cbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBFdXJvXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gVmVyZsO8Z2JhcmUgRXVyb1wiLFxuICAgICAgICAgICAgXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICAvL2JpdHN0YW1wQlRDXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wQlRDXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gQml0Y29pbnNcIixcbiAgICAgICAgICAgIFwiYml0c3RhbXBcIik7XG5cblxuICAgICAgICAvL2JpdHN0YW1wUmlwcGxlc1xuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcFJpcHBsZXNcIixcbiAgICAgICAgICAgIFwiQml0c3RhbXAgLSBSaXBwbGVzXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG4gICAgICAgIC8vY3JlYXRlIGJpdGZpbmV4IHBvcnRmb2xpbyBpdGVtc1xuICAgICAgICAvL2JpdGZpbmV4SU9UQVxuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leElPVEFcIixcbiAgICAgICAgICAgIFwiQml0ZmluZXggLSBJT1RBXCIsXG4gICAgICAgICAgICBcImJpdGZpbmV4XCIpO1xuXG4gICAgICAgIC8vYml0ZmluZXhCVENcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhCVENcIixcbiAgICAgICAgICAgIFwiQml0ZmluZXggLSBCaXRjb2luc1wiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcblxuICAgICAgICAvL2JpdGZpbmV4RGFzaFxuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leERhc2hcIixcbiAgICAgICAgICAgIFwiQml0ZmluZXggLSBEYXNoXCIsXG4gICAgICAgICAgICBcImJpdGZpbmV4XCIpO1xuICAgIH0qL1xuXG5cbiAgICAvKmluaXRpYWxpemVQcmljZXMoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImx0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIsIFwiTFRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIiwgXCJCVEMvRVVSXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJ4cnBcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiLCBcIlhSUC9FVVJcIik7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIiwgXCJJT1RBL0JUQ1wiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIiwgXCJCVEMvRVVSXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJldGhcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiLCBcIkVUSC9VU0RcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImlvdFwiLCBcImV0aFwiLCBcImJpdGZpbmV4XCIsIFwiSU9UQS9FVEhcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIsIFwiQlRDL1VTRFwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZHNoXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIiwgXCJEU0gvVVNEXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJkc2hcIiwgXCJidGNcIiwgXCJiaXRmaW5leFwiLCBcIkRTSC9CVENcIik7XG5cbiAgICAgICAgdGhpcy5zYXZlUHJpY2VJbmZvcm1hdGlvbigpO1xuICAgIH0qL1xuXG5cbiAgICAvKmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ3VycmVuY3lQcmljZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmNyZWF0ZUN1cnJlbmN5UHJpY2UoZnJvbSwgdG8sIGRlc2NyaXB0aW9uLCBwbGF0Zm9ybSk7XG4gICAgfSovXG5cbiAgICBzYXZlUHJpY2VJbmZvcm1hdGlvbigpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVQcmVzc2VkKCkge1xuICAgICAgICBzd2l0Y2godGhpcy50YWJTZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgLy9jYWxjdWxhdGlvbiBmaWVsZCBzaG91bGQgYmUgY3JlYXRlZFxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jcmVhdGVDYWxjdWxhdGlvblJlc3VsdFwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIC8vcG9ydGZvbGlvIGl0ZW0gc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlUG9ydGZvbGlvSXRlbVwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6IFxuICAgICAgICAgICAgICAgIC8vY3VycmVuY3kgcHJpY2Ugc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlQ3VycmVuY3lQcmljZVwiXSk7IFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBvblRhYkluZGV4Q2hhbmdlZChldmVudCkge1xuICAgICAgICBpZih0aGlzLnRhYlNlbGVjdGVkSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVCdXR0b25WaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBZE1vYiBmdW5jdGlvbnNcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHB1YmxpYyBjcmVhdGVCYW5uZXIoKSB7XG4gICAgICAgIC8vZGlmZmVyZW50IG1hcmdpbiBmb3IgaVBob25lIFggYmVjYXVzZSBvZiB0aGUgYmlnZ2VyIHNjcmVlblxuICAgICAgICBpZiAocGxhdGZvcm1Nb2R1bGUuc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0UGl4ZWxzID09PSAyNDM2ICYmXG4gICAgICAgICAgICBwbGF0Zm9ybU1vZHVsZS5kZXZpY2UuZGV2aWNlVHlwZSA9PT0gXCJQaG9uZVwiKSB7XG4gICAgICAgICAgICB0aGlzLnRhYkJhck1hcmdpbiA9IDUwO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVyLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQWRtb2IuY3JlYXRlQmFubmVyKHtcbiAgICAgICAgICAgICAgICB0ZXN0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvL3Rlc3Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgc2l6ZTogQWRtb2IuQURfU0laRS5TTUFSVF9CQU5ORVIsXG4gICAgICAgICAgICAgICAgaW9zQmFubmVySWQ6IHRoaXMuaW9zQmFubmVySWQsXG4gICAgICAgICAgICAgICAgLy9hbmRyb2lkQmFubmVySWQ6IHRoaXMuYW5kcm9pZEJhbm5lcklkLFxuICAgICAgICAgICAgICAgIGlvc1Rlc3REZXZpY2VJZHM6IFtcIjlGRTNDNEU4LUM3REItNDBFQi1CQ0NELTg0QTQzMDUwRUVBQlwiLCBcImRlZTg4MWI3OGM2N2M2NDIwYWMzY2I0MWFkZDQ2YTk0XCJdLFxuICAgICAgICAgICAgICAgIG1hcmdpbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVCYW5uZXIgZG9uZVwiKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlQmFubmVyIGVycm9yOiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVJbnRlcnN0aXRpYWwoKSB7XG4gICAgICAgIHRpbWVyLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQWRtb2IuY3JlYXRlSW50ZXJzdGl0aWFsKHtcbiAgICAgICAgICAgICAgICB0ZXN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlvc0ludGVyc3RpdGlhbElkOiB0aGlzLmlvc0ludGVyc3RpdGlhbElkLFxuICAgICAgICAgICAgICAgIC8vYW5kcm9pZEludGVyc3RpdGlhbElkOiB0aGlzLmFuZHJvaWRJbnRlcnN0aXRpYWxJZCxcbiAgICAgICAgICAgICAgICBpb3NUZXN0RGV2aWNlSWRzOiBbXCI5RkUzQzRFOC1DN0RCLTQwRUItQkNDRC04NEE0MzA1MEVFQUJcIiwgXCJkZWU4ODFiNzhjNjdjNjQyMGFjM2NiNDFhZGQ0NmE5NFwiXVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVJbnRlcnN0aXRpYWwgZG9uZVwiKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlSW50ZXJzdGl0aWFsIGVycm9yOiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgIH1cblxuXG4gICAgLy9jYWxjdWxhdGlvbnNcbiAgICAvKmNhbGN1bGF0ZUFsbCgpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVJT1RBRXVyb1ZpYUJUQygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZURhc2hFdXJvVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlRGFzaFVTRCgpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUJUQ0lPVEEoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVCVENFdXJvKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQlRDVVNEKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlSU9UQVVTRFZpYUJUQygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUlPVEFVU0RWaWFFVEgoKTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbEV1cm9WaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBbGxVU0RWaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBbGxVU0RWaWFFdGhlcmV1bSgpO1xuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsQml0c3RhbXAoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVJT1RBRXVyb1ZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICh0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIikpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJldXJcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjSU9UQUV1cm8gPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVEYXNoRXVyb1ZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICh0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhEYXNoXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiZHNoXCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIikpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJldXJcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjRGFzaEV1cm9WaWFCVEMgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVEYXNoVVNEKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4RGFzaFwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImRzaFwiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNEYXNoVVNEID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlQlRDRXVybygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leEJUQ1wiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcImV1clwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNCVENFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlQlRDVVNEKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JUQ1VTRCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUlPVEFVU0RWaWFFVEgoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4SU9UQVwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImlvdFwiLCBcImV0aFwiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiZXRoXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0lPVEFVU0RWaWFFVEggPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVJT1RBVVNEVmlhQlRDKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leElPVEFcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJpb3RcIiwgXCJidGNcIiwgXCJiaXRmaW5leFwiKSkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNJT1RBVVNEVmlhQlRDID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlQWxsRXVyb1ZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjQlRDRXVybykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0lPVEFFdXJvKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjRGFzaEV1cm9WaWFCVEMpO1xuICAgICAgICB0aGlzLkNhbGNBbGxFdXJvVmlhQlRDID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlQWxsVVNEVmlhRXRoZXJldW0oKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBwYXJzZUZsb2F0KHRoaXMuQ2FsY0lPVEFVU0RWaWFFVEgpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNCVENVU0QpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNEYXNoVVNEKTtcbiAgICAgICAgdGhpcy5DYWxjQWxsVVNEVmlhRVRIID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlQWxsVVNEVmlhQlRDKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBVVNEVmlhQlRDKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjQlRDVVNEKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjRGFzaFVTRCk7XG4gICAgICAgIHRoaXMuQ2FsY0FsbFVTRFZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ0lPVEEoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhCVENcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpIC8gdGhpcy5nZXRDb3Vyc2UoXCJpb3RcIiwgXCJidGNcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQlRDSU9UQSA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuXG4gICAgY2FsY3VsYXRlQWxsQml0c3RhbXAoKSB7XG4gICAgICAgIGxldCBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEV1cm9cIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gcXVhbnRpdHkgLyB0aGlzLmdldENvdXJzZShcImx0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcExUQ0Ftb3VudEVVUiA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBCVENBbW91bnRFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBFdXJvXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgcmVzdWx0ID0gcXVhbnRpdHkgLyB0aGlzLmdldENvdXJzZShcInhycFwiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcFhSUEFtb3VudEV1cm8gPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcExpdGVjb2luc1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIHJlc3VsdCA9IHF1YW50aXR5ICogdGhpcy5nZXRDb3Vyc2UoXCJsdGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBMVENFVVIgPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEJUQ1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIHJlc3VsdCA9IHF1YW50aXR5ICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBCVENFVVIgPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcFJpcHBsZXNcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwieHJwXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wWFJQRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcmVzdWx0ID0gcGFyc2VGbG9hdCh0aGlzLkNhbGNCaXRzdGFtcEJUQ0VVUikgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JpdHN0YW1wTFRDRVVSKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjQml0c3RhbXBYUlBFVVIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcEFsbEV1cm8gPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9Ki9cbiAgICBcbn0iXX0=