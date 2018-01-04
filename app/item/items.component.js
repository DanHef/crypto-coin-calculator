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
var router_2 = require("nativescript-angular/router");
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
    function ItemsComponent(itemService, portfolioItemService, router, currencyPriceService, calculationService, pageRoute) {
        this.itemService = itemService;
        this.portfolioItemService = portfolioItemService;
        this.router = router;
        this.currencyPriceService = currencyPriceService;
        this.calculationService = calculationService;
        this.pageRoute = pageRoute;
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
        this.calculationService.loadCurrencyPrices();
        this.refreshPortfolio();
        //this method only refreshes the currency price data from the local storage => to have the actual prices refresh on the data has to be performed
        this.refreshMaintainedCurrencyPrices();
        this.refreshMaintainedCalculationResults();
        //read data from the respective platforms
        var promiseBitfinex = this.refreshBitfinexData();
        var promiseBitstamp = this.refreshBitstampData();
        Promise.all([promiseBitfinex, promiseBitstamp]).then(function () {
            _this.calculateResults();
            _this.refreshMaintainedCalculationResults();
        });
        this.currencyPriceService.currencyPricesChanged.subscribe(function () {
            this.refreshMaintainedCurrencyPrices();
        }.bind(this));
        /*this.pageRoute.activatedRoute.forEach(function() {
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
        }.bind(this));*/
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
            calculation_service_1.CalculationService,
            router_2.PageRoute])
    ], ItemsComponent);
    return ItemsComponent;
}());
exports.ItemsComponent = ItemsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdFO0FBQ2hFLDJFQUE0RDtBQUk1RCwrQ0FBNkM7QUFDN0MsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUN6RSxzRUFBb0U7QUFFcEUsMENBQTRDO0FBQzVDLDZCQUErQjtBQUMvQiwwREFBNEQ7QUFFNUQsMENBQXlEO0FBQ3pELHNEQUF3RDtBQUd4RCxtREFBbUQ7QUFRbkQ7SUFzQkk7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQ0FrQjhCO0lBRzlCLHdCQUE2QixXQUF3QixFQUN4QixvQkFBMEMsRUFDMUMsTUFBYyxFQUNkLG9CQUEwQyxFQUMxQyxrQkFBc0MsRUFDdEMsU0FBb0I7UUFMcEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGNBQVMsR0FBVCxTQUFTLENBQVc7UUEvQ3pDLGtCQUFhLEdBQTZCLEVBQUUsQ0FBQztRQUU3QywyQkFBc0IsR0FBb0IsRUFBRSxDQUFDO1FBQzdDLDJCQUFzQixHQUFvQixFQUFFLENBQUM7UUFFN0Msc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLDBCQUFxQixHQUFHLEVBQUUsQ0FBQztRQUUzQixrQkFBYSxHQUFHLElBQUksMkNBQWEsRUFBRSxDQUFDO1FBRXBDLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUMxQix3QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFFN0MsOEJBQThCO1FBQzlCLDJEQUEyRDtRQUMzRCxpRUFBaUU7UUFDekQsZ0JBQVcsR0FBVyx3Q0FBd0MsQ0FBQztRQUMvRCxz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QUFDLGtCQUFrQixDQUFDO2dCQUNyQixPQUFPLEVBQUUsSUFBSTtnQkFDYixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO2dCQUN6QyxvREFBb0Q7Z0JBQ3BELGdCQUFnQixFQUFFLENBQUMsc0NBQXNDLEVBQUUsa0NBQWtDLENBQUM7YUFDakcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDakQsQ0FBQyxFQUFFLFVBQVUsS0FBSztnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBalZRLGNBQWM7UUFMMUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsd0JBQXdCO1NBQ3hDLENBQUM7eUNBNEM0QywwQkFBVztZQUNGLDZDQUFvQjtZQUNsQyxlQUFNO1lBQ1EsNkNBQW9CO1lBQ3RCLHdDQUFrQjtZQUMzQixrQkFBUztPQWhEeEMsY0FBYyxDQTJiMUI7SUFBRCxxQkFBQztDQUFBLEFBM2JELElBMmJDO0FBM2JZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEFmdGVyVmlld0luaXR9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlIH0gZnJvbSAnLi9DdXJyZW5jeVByaWNlJztcbmltcG9ydCB7IENvaW5Qb3J0Zm9saW9JdGVtIH0gZnJvbSAnLi9Db2luUG9ydGZvbGlvSXRlbSc7XG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgUG9ydGZvbGlvSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9wb3J0Zm9saW8taXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2N1cnJlbmN5LXByaWNlLnNlcnZpY2VcIjtcbmltcG9ydCB7IENhbGN1bGF0aW9uU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2NhbGN1bGF0aW9uLnNlcnZpY2VcIjtcblxuaW1wb3J0ICogYXMgQWRtb2IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1hZG1vYlwiO1xuaW1wb3J0ICogYXMgdGltZXIgZnJvbSBcInRpbWVyXCI7XG5pbXBvcnQgKiBhcyBwbGF0Zm9ybU1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuXG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUGFnZVJvdXRlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgQnJvd3NlclBsYXRmb3JtTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9zcmMvYnJvd3Nlci9sb2NhdGlvbi9icm93c2VyX3BsYXRmb3JtX2xvY2F0aW9uXCI7XG5cbi8vaW1wb3J0ICogYXMgY29uZmlnU2V0dGluZ3MgZnJvbSBcIi4uL2NvbmZpZy5qc29uXCI7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vaXRlbXMuY29tcG9uZW50Lmh0bWxcIixcbn0pXG5leHBvcnQgY2xhc3MgSXRlbXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICAgIHByaXZhdGUgY29pblBvcnRmb2xpbzogQXJyYXk8Q29pblBvcnRmb2xpb0l0ZW0+ID0gW107XG5cbiAgICBwcml2YXRlIGN1cnJlbmN5UHJpY2VzQml0c3RhbXA6IEN1cnJlbmN5UHJpY2VbXSA9IFtdO1xuICAgIHByaXZhdGUgY3VycmVuY3lQcmljZXNCaXRmaW5leDogQ3VycmVuY3lQcmljZVtdID0gW107XG5cbiAgICBwcml2YXRlIGNhbGNSZXN1bHRHZW5lcmFsID0gW107XG4gICAgcHJpdmF0ZSBjYWxjUmVzdWx0c1BvcnRmb2xpb3MgPSBbXTtcblxuICAgIHByaXZhdGUgc2VjdXJlU3RvcmFnZSA9IG5ldyBTZWN1cmVTdG9yYWdlKCk7XG5cbiAgICBwcml2YXRlIHRhYlNlbGVjdGVkSW5kZXg6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSB0YWJCYXJNYXJnaW46IG51bWJlciA9IDUwO1xuICAgIHByaXZhdGUgY3JlYXRlQnV0dG9uVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLy9BZE1vYiBmb3IgQW5kcm9pZCB0byBiZSBkb25lXG4gICAgLy9wcml2YXRlIGFuZHJvaWRCYW5uZXJJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLVhYWFgvWVlZWVwiO1xuICAgIC8vcHJpdmF0ZSBhbmRyb2lkSW50ZXJzdGl0aWFsSWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi1LS0tLL0xMTExcIjtcbiAgICBwcml2YXRlIGlvc0Jhbm5lcklkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItMzcwNDQzOTA4NTAzMjA4Mi8zODYzOTAzMjUyXCI7XG4gICAgcHJpdmF0ZSBpb3NJbnRlcnN0aXRpYWxJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLTM3MDQ0MzkwODUwMzIwODIvNjIxMjQ3OTM5NFwiO1xuICAgIFxuXG4gICAgLypDYWxjSU9UQUV1cm86IHN0cmluZztcbiAgICBDYWxjSU9UQVVTRFZpYUVUSDogc3RyaW5nO1xuICAgIENhbGNJT1RBVVNEVmlhQlRDOiBzdHJpbmc7XG4gICAgQ2FsY0Rhc2hFdXJvVmlhQlRDOiBzdHJpbmc7XG4gICAgQ2FsY0Rhc2hVU0Q6IHN0cmluZztcbiAgICBDYWxjQlRDRXVybzogc3RyaW5nO1xuICAgIENhbGNCVENVU0Q6IHN0cmluZztcbiAgICBDYWxjQlRDSU9UQTogc3RyaW5nO1xuICAgIENhbGNBbGxFdXJvVmlhQlRDOiBzdHJpbmc7XG4gICAgQ2FsY0FsbFVTRFZpYUVUSDogc3RyaW5nO1xuICAgIENhbGNBbGxVU0RWaWFCVEM6IHN0cmluZztcblxuICAgIENhbGNCaXRzdGFtcExUQ0Ftb3VudEVVUjogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcEJUQ0Ftb3VudEV1cm86IHN0cmluZztcbiAgICBDYWxjQml0c3RhbXBYUlBBbW91bnRFdXJvOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wTFRDRVVSOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wQlRDRVVSOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wWFJQRVVSOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wQWxsRXVybzogc3RyaW5nOyovXG5cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaXRlbVNlcnZpY2U6IEl0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjdXJyZW5jeVByaWNlU2VydmljZTogQ3VycmVuY3lQcmljZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjYWxjdWxhdGlvblNlcnZpY2U6IENhbGN1bGF0aW9uU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHBhZ2VSb3V0ZTogUGFnZVJvdXRlKSB7XG4gICAgfVxuICAgIFxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICAvL2luaXRpYWxpemUgYnVmZmVyc1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmxvYWRQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5sb2FkQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UubG9hZEN1cnJlbmN5UHJpY2VzKCk7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoUG9ydGZvbGlvKCk7XG4gICAgICAgIC8vdGhpcyBtZXRob2Qgb25seSByZWZyZXNoZXMgdGhlIGN1cnJlbmN5IHByaWNlIGRhdGEgZnJvbSB0aGUgbG9jYWwgc3RvcmFnZSA9PiB0byBoYXZlIHRoZSBhY3R1YWwgcHJpY2VzIHJlZnJlc2ggb24gdGhlIGRhdGEgaGFzIHRvIGJlIHBlcmZvcm1lZFxuICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoTWFpbnRhaW5lZENhbGN1bGF0aW9uUmVzdWx0cygpO1xuXG4gICAgICAgIC8vcmVhZCBkYXRhIGZyb20gdGhlIHJlc3BlY3RpdmUgcGxhdGZvcm1zXG4gICAgICAgIGxldCBwcm9taXNlQml0ZmluZXggPSB0aGlzLnJlZnJlc2hCaXRmaW5leERhdGEoKTtcbiAgICAgICAgbGV0IHByb21pc2VCaXRzdGFtcCA9IHRoaXMucmVmcmVzaEJpdHN0YW1wRGF0YSgpO1xuXG4gICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVSZXN1bHRzKCk7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuY3VycmVuY3lQcmljZXNDaGFuZ2VkLnN1YnNjcmliZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8qdGhpcy5wYWdlUm91dGUuYWN0aXZhdGVkUm91dGUuZm9yRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBvcnRmb2xpbygpO1xuICAgICAgICAgICAgLy90aGlzIG1ldGhvZCBvbmx5IHJlZnJlc2hlcyB0aGUgY3VycmVuY3kgcHJpY2UgZGF0YSBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlID0+IHRvIGhhdmUgdGhlIGFjdHVhbCBwcmljZXMgcmVmcmVzaCBvbiB0aGUgZGF0YSBoYXMgdG8gYmUgcGVyZm9ybWVkXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKTtcbiAgICBcbiAgICAgICAgICAgIC8vcmVhZCBkYXRhIGZyb20gdGhlIHJlc3BlY3RpdmUgcGxhdGZvcm1zXG4gICAgICAgICAgICBsZXQgcHJvbWlzZUJpdGZpbmV4ID0gdGhpcy5yZWZyZXNoQml0ZmluZXhEYXRhKCk7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5yZWZyZXNoQml0c3RhbXBEYXRhKCk7XG4gICAgXG4gICAgICAgICAgICBQcm9taXNlLmFsbChbcHJvbWlzZUJpdGZpbmV4LCBwcm9taXNlQml0c3RhbXBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlc3VsdHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTsqL1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgLy90aGlzLmNyZWF0ZUludGVyc3RpdGlhbCgpO1xuICAgICAgICAvL3RoaXMuY3JlYXRlQmFubmVyKCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBkYXRhIHJlZnJlc2ggbG9naWNcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIG9uUmVmcmVzaFRyaWdnZXJlZChldmVudCkge1xuICAgICAgICB2YXIgcHVsbFRvUmVmcmVzaCA9IGV2ZW50Lm9iamVjdDtcblxuICAgICAgICB0aGlzLnJlZnJlc2hBbGwocHVsbFRvUmVmcmVzaCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEFsbChwdWxsVG9SZWZyZXNoKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFBvcnRmb2xpbygpO1xuICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcblxuICAgICAgICBsZXQgcHJvbWlzZUJpdGZpbmV4ID0gdGhpcy5yZWZyZXNoQml0ZmluZXhEYXRhKCk7XG4gICAgICAgIGxldCBwcm9taXNlQml0c3RhbXAgPSB0aGlzLnJlZnJlc2hCaXRzdGFtcERhdGEoKTtcblxuICAgICAgICBQcm9taXNlLmFsbChbcHJvbWlzZUJpdGZpbmV4LCBwcm9taXNlQml0c3RhbXBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlUmVzdWx0cygpO1xuICAgICAgICAgICAgcHVsbFRvUmVmcmVzaC5yZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZnJlc2hCaXRzdGFtcERhdGEoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZXMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0c3RhbXBcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLml0ZW1TZXJ2aWNlLmxvYWREYXRhRnJvbUJpdHN0YW1wV2l0aFN5bWJvbChjdXJyZW5jeVByaWNlc1tpXSk7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZnJlc2hCaXRmaW5leERhdGEoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZXMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0ZmluZXhcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLml0ZW1TZXJ2aWNlLmxvYWREYXRhRnJvbUJpdGZpbmV4V2l0aFN5bWJvbChjdXJyZW5jeVByaWNlc1tpXSk7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcmVmcmVzaFBvcnRmb2xpbygpIHtcbiAgICAgICAgdGhpcy5jb2luUG9ydGZvbGlvID0gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5nZXRBbGxQb3J0Zm9saW9JdGVtcygpO1xuICAgIH1cblxuICAgIHJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNCaXRmaW5leCA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0JpdHN0YW1wID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdHN0YW1wXCIpO1xuICAgIH1cblxuICAgIHJlZnJlc2hNYWludGFpbmVkQ2FsY3VsYXRpb25SZXN1bHRzKCkge1xuICAgICAgICB0aGlzLmNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IHRoaXMuY2FsY3VsYXRpb25TZXJ2aWNlLmdldEFsbENhbGN1bGF0aW9uUmVzdWx0cygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVJlc3VsdHMoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRpb25TZXJ2aWNlLmNhbGN1bGF0ZUFsbFJlc3VsdHMoKTtcbiAgICAgICAgdGhpcy5jYWxjUmVzdWx0c1BvcnRmb2xpb3MgPSB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5nZXRBbGxDYWxjdWxhdGlvblJlc3VsdHMoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9FTkQ6IGRhdGEgcmVmcmVzaCBsb2dpY1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICBnZXRDb3Vyc2UoZnJvbSwgdG8sIHBsYXRmb3JtKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0Q3VycmVuY3lQcmljZUFtb3VudChmcm9tLCB0bywgcGxhdGZvcm0pO1xuICAgIH1cblxuICAgIGdldFF1YW50aXR5KHBvcnRmb2xpb0l0ZW06IENvaW5Qb3J0Zm9saW9JdGVtKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBwb3J0Zm9saW9JdGVtLmdldFF1YW50aXR5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGdldENvaW5Qb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lOiBzdHJpbmcsIHBvcnRmb2xpbzogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5nZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW8pO1xuICAgIH1cblxuXG4gICAgY3JlYXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb246IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcsIHN5bWJvbDogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5jcmVhdGVQb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24sIDAsIHBvcnRmb2xpbywgc3ltYm9sKTtcbiAgICB9XG5cbiAgICBvblBvcnRmb2xpb0l0ZW1RdWFudGl0eUNoYW5nZShxdWFudGl0eSwgcG9ydGZvbGlvSXRlbSkge1xuICAgICAgICBsZXQgY2hhbmdlZFBvcnRmb2xpb0l0ZW0gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUocG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSxwb3J0Zm9saW9JdGVtLnBvcnRmb2xpb05hbWUpO1xuICAgICAgICBjaGFuZ2VkUG9ydGZvbGlvSXRlbS5zZXRRdWFudGl0eShxdWFudGl0eSk7XG5cbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuXG5cbiAgICAvKmluaXRpYWxpemVQb3J0Zm9saW8oKSB7XG4gICAgICAgIC8vY3JlYXRlIGJpdHN0YW1wIHBvcnRmb2xpbyBpdGVtc1xuICAgICAgICAvL2JpdHN0YW1wTGl0ZWNvaW5zXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wTGl0ZWNvaW5zXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gTGl0ZWNvaW5zXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG4gICAgICAgIC8vYml0c3RhbXBFdXJvXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLFxuICAgICAgICAgICAgXCJCaXRzdGFtcCAtIFZlcmbDvGdiYXJlIEV1cm9cIixcbiAgICAgICAgICAgIFwiYml0c3RhbXBcIik7XG5cbiAgICAgICAgLy9iaXRzdGFtcEJUQ1xuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEJUQ1wiLFxuICAgICAgICAgICAgXCJCaXRzdGFtcCAtIEJpdGNvaW5zXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG5cbiAgICAgICAgLy9iaXRzdGFtcFJpcHBsZXNcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBSaXBwbGVzXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gUmlwcGxlc1wiLFxuICAgICAgICAgICAgXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICAvL2NyZWF0ZSBiaXRmaW5leCBwb3J0Zm9saW8gaXRlbXNcbiAgICAgICAgLy9iaXRmaW5leElPVEFcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gSU9UQVwiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcblxuICAgICAgICAvL2JpdGZpbmV4QlRDXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gQml0Y29pbnNcIixcbiAgICAgICAgICAgIFwiYml0ZmluZXhcIik7XG5cbiAgICAgICAgLy9iaXRmaW5leERhc2hcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhEYXNoXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gRGFzaFwiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcbiAgICB9Ki9cblxuXG4gICAgLyppbml0aWFsaXplUHJpY2VzKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJsdGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiLCBcIkxUQy9FVVJcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIsIFwiQlRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwieHJwXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIiwgXCJYUlAvRVVSXCIpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIsIFwiSU9UQS9CVENcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcImV1clwiLCBcImJpdGZpbmV4XCIsIFwiQlRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZXRoXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIiwgXCJFVEgvVVNEXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJpb3RcIiwgXCJldGhcIiwgXCJiaXRmaW5leFwiLCBcIklPVEEvRVRIXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJidGNcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiLCBcIkJUQy9VU0RcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImRzaFwiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIsIFwiRFNIL1VTRFwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZHNoXCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIiwgXCJEU0gvQlRDXCIpO1xuXG4gICAgICAgIHRoaXMuc2F2ZVByaWNlSW5mb3JtYXRpb24oKTtcbiAgICB9Ki9cblxuXG4gICAgLypjcmVhdGVQcmljZUluZm9ybWF0aW9uKGZyb206IHN0cmluZywgdG86IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IEN1cnJlbmN5UHJpY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5jcmVhdGVDdXJyZW5jeVByaWNlKGZyb20sIHRvLCBkZXNjcmlwdGlvbiwgcGxhdGZvcm0pO1xuICAgIH0qL1xuXG4gICAgc2F2ZVByaWNlSW5mb3JtYXRpb24oKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUHJlc3NlZCgpIHtcbiAgICAgICAgc3dpdGNoKHRoaXMudGFiU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIC8vY2FsY3VsYXRpb24gZmllbGQgc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlQ2FsY3VsYXRpb25SZXN1bHRcIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiBcbiAgICAgICAgICAgICAgICAvL3BvcnRmb2xpbyBpdGVtIHNob3VsZCBiZSBjcmVhdGVkXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWF0ZVBvcnRmb2xpb0l0ZW1cIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiBcbiAgICAgICAgICAgICAgICAvL2N1cnJlbmN5IHByaWNlIHNob3VsZCBiZSBjcmVhdGVkXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWF0ZUN1cnJlbmN5UHJpY2VcIl0pOyBcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25UYWJJbmRleENoYW5nZWQoZXZlbnQpIHtcbiAgICAgICAgaWYodGhpcy50YWJTZWxlY3RlZEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvblZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQWRNb2IgZnVuY3Rpb25zXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwdWJsaWMgY3JlYXRlQmFubmVyKCkge1xuICAgICAgICAvL2RpZmZlcmVudCBtYXJnaW4gZm9yIGlQaG9uZSBYIGJlY2F1c2Ugb2YgdGhlIGJpZ2dlciBzY3JlZW5cbiAgICAgICAgaWYgKHBsYXRmb3JtTW9kdWxlLnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodFBpeGVscyA9PT0gMjQzNiAmJlxuICAgICAgICAgICAgcGxhdGZvcm1Nb2R1bGUuZGV2aWNlLmRldmljZVR5cGUgPT09IFwiUGhvbmVcIikge1xuICAgICAgICAgICAgdGhpcy50YWJCYXJNYXJnaW4gPSA1MDtcbiAgICAgICAgfVxuICAgICAgICB0aW1lci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEFkbW9iLmNyZWF0ZUJhbm5lcih7XG4gICAgICAgICAgICAgICAgdGVzdGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy90ZXN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNpemU6IEFkbW9iLkFEX1NJWkUuU01BUlRfQkFOTkVSLFxuICAgICAgICAgICAgICAgIGlvc0Jhbm5lcklkOiB0aGlzLmlvc0Jhbm5lcklkLFxuICAgICAgICAgICAgICAgIC8vYW5kcm9pZEJhbm5lcklkOiB0aGlzLmFuZHJvaWRCYW5uZXJJZCxcbiAgICAgICAgICAgICAgICBpb3NUZXN0RGV2aWNlSWRzOiBbXCI5RkUzQzRFOC1DN0RCLTQwRUItQkNDRC04NEE0MzA1MEVFQUJcIiwgXCJkZWU4ODFiNzhjNjdjNjQyMGFjM2NiNDFhZGQ0NmE5NFwiXSxcbiAgICAgICAgICAgICAgICBtYXJnaW5zOiB7XG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlQmFubmVyIGRvbmVcIik7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUJhbm5lciBlcnJvcjogXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlSW50ZXJzdGl0aWFsKCkge1xuICAgICAgICB0aW1lci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEFkbW9iLmNyZWF0ZUludGVyc3RpdGlhbCh7XG4gICAgICAgICAgICAgICAgdGVzdGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpb3NJbnRlcnN0aXRpYWxJZDogdGhpcy5pb3NJbnRlcnN0aXRpYWxJZCxcbiAgICAgICAgICAgICAgICAvL2FuZHJvaWRJbnRlcnN0aXRpYWxJZDogdGhpcy5hbmRyb2lkSW50ZXJzdGl0aWFsSWQsXG4gICAgICAgICAgICAgICAgaW9zVGVzdERldmljZUlkczogW1wiOUZFM0M0RTgtQzdEQi00MEVCLUJDQ0QtODRBNDMwNTBFRUFCXCIsIFwiZGVlODgxYjc4YzY3YzY0MjBhYzNjYjQxYWRkNDZhOTRcIl1cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlSW50ZXJzdGl0aWFsIGRvbmVcIik7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUludGVyc3RpdGlhbCBlcnJvcjogXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICB9XG5cblxuICAgIC8vY2FsY3VsYXRpb25zXG4gICAgLypjYWxjdWxhdGVBbGwoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlSU9UQUV1cm9WaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVEYXNoRXVyb1ZpYUJUQygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZURhc2hVU0QoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVCVENJT1RBKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQlRDRXVybygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUJUQ1VTRCgpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUlPVEFVU0RWaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVJT1RBVVNEVmlhRVRIKCk7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBbGxFdXJvVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsVVNEVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsVVNEVmlhRXRoZXJldW0oKTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbEJpdHN0YW1wKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQUV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4SU9UQVwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0lPVEFFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlRGFzaEV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4RGFzaFwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImRzaFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0Rhc2hFdXJvVmlhQlRDID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlRGFzaFVTRCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leERhc2hcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJkc2hcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjRGFzaFVTRCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ0V1cm8oKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhCVENcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJldXJcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQlRDRXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ1VTRCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leEJUQ1wiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNCVENVU0QgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVJT1RBVVNEVmlhRVRIKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leElPVEFcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJpb3RcIiwgXCJldGhcIiwgXCJiaXRmaW5leFwiKSkgKiB0aGlzLmdldENvdXJzZShcImV0aFwiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNJT1RBVVNEVmlhRVRIID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQVVTRFZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICh0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIikpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjSU9UQVVTRFZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbEV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ0V1cm8pICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBRXVybykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hFdXJvVmlhQlRDKTtcbiAgICAgICAgdGhpcy5DYWxjQWxsRXVyb1ZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbFVTRFZpYUV0aGVyZXVtKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBVVNEVmlhRVRIKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjQlRDVVNEKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjRGFzaFVTRCk7XG4gICAgICAgIHRoaXMuQ2FsY0FsbFVTRFZpYUVUSCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbFVTRFZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjSU9UQVVTRFZpYUJUQykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ1VTRCkgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hVU0QpO1xuICAgICAgICB0aGlzLkNhbGNBbGxVU0RWaWFCVEMgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVCVENJT1RBKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAvIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JUQ0lPVEEgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cblxuICAgIGNhbGN1bGF0ZUFsbEJpdHN0YW1wKCkge1xuICAgICAgICBsZXQgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBFdXJvXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJsdGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBMVENBbW91bnRFVVIgPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEV1cm9cIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAvIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQlRDQW1vdW50RXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJ4cnBcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBYUlBBbW91bnRFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBMaXRlY29pbnNcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwibHRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wTFRDRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBCVENcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQlRDRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBSaXBwbGVzXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgcmVzdWx0ID0gcXVhbnRpdHkgKiB0aGlzLmdldENvdXJzZShcInhycFwiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcFhSUEVVUiA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjQml0c3RhbXBCVENFVVIpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNCaXRzdGFtcExUQ0VVUikgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JpdHN0YW1wWFJQRVVSKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBBbGxFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfSovXG4gICAgXG59Il19