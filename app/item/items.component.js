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
        this.calcResultOverall = 0;
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
    };
    ItemsComponent.prototype.calcResultDelete = function (calculationResult) {
        this.calculationService.deleteCalculationResult(calculationResult);
        this.calculationService.saveCalculationResults();
    };
    ItemsComponent.prototype.portfolioItemDelete = function (portfolioItem) {
        this.portfolioItemService.deletePortfolioItem(portfolioItem);
        this.portfolioItemService.savePortfolio();
    };
    ItemsComponent.prototype.currencyPriceDelete = function (currencyPrice) {
        this.currencyPriceService.deleteCurrencyPrice(currencyPrice);
        this.currencyPriceService.saveCurrencyPrices();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdFO0FBQ2hFLDJFQUE0RDtBQUk1RCwrQ0FBNkM7QUFDN0MsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUN6RSxzRUFBb0U7QUFFcEUsMENBQTRDO0FBQzVDLDZCQUErQjtBQUMvQiwwREFBNEQ7QUFFNUQsMENBQXlEO0FBQ3pELHNEQUF3RDtBQUl4RCxtREFBbUQ7QUFRbkQ7SUF3Qkksd0JBQTZCLFdBQXdCLEVBQ3hCLG9CQUEwQyxFQUMxQyxNQUFjLEVBQ2Qsb0JBQTBDLEVBQzFDLGtCQUFzQyxFQUN0QyxTQUFvQjtRQUxwQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsY0FBUyxHQUFULFNBQVMsQ0FBVztRQTVCekMsa0JBQWEsR0FBNkIsRUFBRSxDQUFDO1FBRTdDLDJCQUFzQixHQUFvQixFQUFFLENBQUM7UUFDN0MsMkJBQXNCLEdBQW9CLEVBQUUsQ0FBQztRQUVyRCxzQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFFdEIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLDBCQUFxQixHQUFHLEVBQUUsQ0FBQztRQUUzQixrQkFBYSxHQUFHLElBQUksMkNBQWEsRUFBRSxDQUFDO1FBRXBDLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUMxQix3QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFFN0MsOEJBQThCO1FBQzlCLDJEQUEyRDtRQUMzRCxpRUFBaUU7UUFDekQsZ0JBQVcsR0FBVyx3Q0FBd0MsQ0FBQztRQUMvRCxzQkFB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QW9CO1lBQ2xDLGVBQU07WUFDUSw2Q0FBb0I7WUFDdEIsd0NBQWtCO1lBQzNCLGtCQUFTO09BN0J4QyxjQUFjLENBd2ExQjtJQUFELHFCQUFDO0NBQUEsQUF4YUQsSUF3YUM7QUF4YVksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XG5cbmltcG9ydCB7IEN1cnJlbmN5UHJpY2UgfSBmcm9tICcuL0N1cnJlbmN5UHJpY2UnO1xuaW1wb3J0IHsgQ29pblBvcnRmb2xpb0l0ZW0gfSBmcm9tICcuL0NvaW5Qb3J0Zm9saW9JdGVtJztcbmltcG9ydCB7IEl0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQb3J0Zm9saW9JdGVtU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL3BvcnRmb2xpby1pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvY3VycmVuY3ktcHJpY2Uuc2VydmljZVwiO1xuaW1wb3J0IHsgQ2FsY3VsYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvY2FsY3VsYXRpb24uc2VydmljZVwiO1xuXG5pbXBvcnQgKiBhcyBBZG1vYiBmcm9tIFwibmF0aXZlc2NyaXB0LWFkbW9iXCI7XG5pbXBvcnQgKiBhcyB0aW1lciBmcm9tIFwidGltZXJcIjtcbmltcG9ydCAqIGFzIHBsYXRmb3JtTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtXCI7XG5cbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBQYWdlUm91dGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL2xvY2F0aW9uL2Jyb3dzZXJfcGxhdGZvcm1fbG9jYXRpb25cIjtcbmltcG9ydCB7IENhbGN1bGF0aW9uUmVzdWx0IH0gZnJvbSBcIi4vQ2FsY3VsYXRpb25SZXN1bHRcIjtcblxuLy9pbXBvcnQgKiBhcyBjb25maWdTZXR0aW5ncyBmcm9tIFwiLi4vY29uZmlnLmpzb25cIjtcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1pdGVtc1wiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9pdGVtcy5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBJdGVtc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcHJpdmF0ZSBjb2luUG9ydGZvbGlvOiBBcnJheTxDb2luUG9ydGZvbGlvSXRlbT4gPSBbXTtcblxuICAgIHByaXZhdGUgY3VycmVuY3lQcmljZXNCaXRzdGFtcDogQ3VycmVuY3lQcmljZVtdID0gW107XG4gICAgcHJpdmF0ZSBjdXJyZW5jeVByaWNlc0JpdGZpbmV4OiBDdXJyZW5jeVByaWNlW10gPSBbXTtcblxuICAgIGNhbGNSZXN1bHRPdmVyYWxsOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBjYWxjUmVzdWx0R2VuZXJhbCA9IFtdO1xuICAgIHByaXZhdGUgY2FsY1Jlc3VsdHNQb3J0Zm9saW9zID0gW107XG5cbiAgICBwcml2YXRlIHNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuXG4gICAgcHJpdmF0ZSB0YWJTZWxlY3RlZEluZGV4OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgdGFiQmFyTWFyZ2luOiBudW1iZXIgPSA1MDtcbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvblZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8vQWRNb2IgZm9yIEFuZHJvaWQgdG8gYmUgZG9uZVxuICAgIC8vcHJpdmF0ZSBhbmRyb2lkQmFubmVySWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi1YWFhYL1lZWVlcIjtcbiAgICAvL3ByaXZhdGUgYW5kcm9pZEludGVyc3RpdGlhbElkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItS0tLSy9MTExMXCI7XG4gICAgcHJpdmF0ZSBpb3NCYW5uZXJJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLTM3MDQ0MzkwODUwMzIwODIvMzg2MzkwMzI1MlwiO1xuICAgIHByaXZhdGUgaW9zSW50ZXJzdGl0aWFsSWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi0zNzA0NDM5MDg1MDMyMDgyLzYyMTI0NzkzOTRcIjtcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBwb3J0Zm9saW9JdGVtU2VydmljZTogUG9ydGZvbGlvSXRlbVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGN1cnJlbmN5UHJpY2VTZXJ2aWNlOiBDdXJyZW5jeVByaWNlU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNhbGN1bGF0aW9uU2VydmljZTogQ2FsY3VsYXRpb25TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcGFnZVJvdXRlOiBQYWdlUm91dGUpIHtcbiAgICB9XG4gICAgXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vaW5pdGlhbGl6ZSBidWZmZXJzXG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UubG9hZFBvcnRmb2xpbygpO1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmxvYWRDdXJyZW5jeVByaWNlcygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5sb2FkQ3VycmVuY3lQcmljZXMoKTtcblxuICAgICAgICB0aGlzLnJlZnJlc2hQb3J0Zm9saW8oKTtcbiAgICAgICAgLy90aGlzIG1ldGhvZCBvbmx5IHJlZnJlc2hlcyB0aGUgY3VycmVuY3kgcHJpY2UgZGF0YSBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlID0+IHRvIGhhdmUgdGhlIGFjdHVhbCBwcmljZXMgcmVmcmVzaCBvbiB0aGUgZGF0YSBoYXMgdG8gYmUgcGVyZm9ybWVkXG4gICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpO1xuICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG5cbiAgICAgICAgLy9yZWFkIGRhdGEgZnJvbSB0aGUgcmVzcGVjdGl2ZSBwbGF0Zm9ybXNcbiAgICAgICAgbGV0IHByb21pc2VCaXRmaW5leCA9IHRoaXMucmVmcmVzaEJpdGZpbmV4RGF0YSgpO1xuICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5yZWZyZXNoQml0c3RhbXBEYXRhKCk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwoW3Byb21pc2VCaXRmaW5leCwgcHJvbWlzZUJpdHN0YW1wXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlc3VsdHMoKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5jdXJyZW5jeVByaWNlc0NoYW5nZWQuc3Vic2NyaWJlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoTWFpbnRhaW5lZEN1cnJlbmN5UHJpY2VzKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICAvL3RoaXMuY3JlYXRlSW50ZXJzdGl0aWFsKCk7XG4gICAgICAgIC8vdGhpcy5jcmVhdGVCYW5uZXIoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRhdGEgcmVmcmVzaCBsb2dpY1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgb25SZWZyZXNoVHJpZ2dlcmVkKGV2ZW50KSB7XG4gICAgICAgIHZhciBwdWxsVG9SZWZyZXNoID0gZXZlbnQub2JqZWN0O1xuXG4gICAgICAgIHRoaXMucmVmcmVzaEFsbChwdWxsVG9SZWZyZXNoKTtcbiAgICB9XG5cbiAgICByZWZyZXNoQWxsKHB1bGxUb1JlZnJlc2gpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoUG9ydGZvbGlvKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpO1xuXG4gICAgICAgIGxldCBwcm9taXNlQml0ZmluZXggPSB0aGlzLnJlZnJlc2hCaXRmaW5leERhdGEoKTtcbiAgICAgICAgbGV0IHByb21pc2VCaXRzdGFtcCA9IHRoaXMucmVmcmVzaEJpdHN0YW1wRGF0YSgpO1xuXG4gICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVSZXN1bHRzKCk7XG4gICAgICAgICAgICBwdWxsVG9SZWZyZXNoLnJlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdHN0YW1wRGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0c3RhbXBXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdGZpbmV4RGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRmaW5leFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0ZmluZXhXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICByZWZyZXNoUG9ydGZvbGlvKCkge1xuICAgICAgICB0aGlzLmNvaW5Qb3J0Zm9saW8gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldEFsbFBvcnRmb2xpb0l0ZW1zKCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0JpdGZpbmV4ID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQml0c3RhbXAgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0c3RhbXBcIik7XG4gICAgfVxuXG4gICAgcmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKSB7XG4gICAgICAgIHRoaXMuY2FsY1Jlc3VsdHNQb3J0Zm9saW9zID0gdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuZ2V0QWxsQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVzdWx0cygpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuY2FsY3VsYXRlQWxsUmVzdWx0cygpO1xuICAgICAgICB0aGlzLmNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IHRoaXMuY2FsY3VsYXRpb25TZXJ2aWNlLmdldEFsbENhbGN1bGF0aW9uUmVzdWx0cygpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL0VORDogZGF0YSByZWZyZXNoIGxvZ2ljXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgIGdldENvdXJzZShmcm9tLCB0bywgcGxhdGZvcm0pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRDdXJyZW5jeVByaWNlQW1vdW50KGZyb20sIHRvLCBwbGF0Zm9ybSk7XG4gICAgfVxuXG4gICAgZ2V0UXVhbnRpdHkocG9ydGZvbGlvSXRlbTogQ29pblBvcnRmb2xpb0l0ZW0pOiBudW1iZXIge1xuICAgICAgICBpZiAocG9ydGZvbGlvSXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHBvcnRmb2xpb0l0ZW0uZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0Q29pblBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcpOiBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUocG9ydGZvbGlvSXRlbU5hbWUsIHBvcnRmb2xpbyk7XG4gICAgfVxuXG5cbiAgICBjcmVhdGVQb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lOiBzdHJpbmcsIHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjogc3RyaW5nLCBwb3J0Zm9saW86IHN0cmluZywgc3ltYm9sOiBzdHJpbmcpOiBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmNyZWF0ZVBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbU5hbWUsIHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbiwgMCwgcG9ydGZvbGlvLCBzeW1ib2wpO1xuICAgIH1cblxuICAgIG9uUG9ydGZvbGlvSXRlbVF1YW50aXR5Q2hhbmdlKHF1YW50aXR5LCBwb3J0Zm9saW9JdGVtKSB7XG4gICAgICAgIGxldCBjaGFuZ2VkUG9ydGZvbGlvSXRlbSA9IHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZ2V0UG9ydGZvbGlvSXRlbUJ5VGVjaG5pY2FsTmFtZShwb3J0Zm9saW9JdGVtLnBvcnRmb2xpb0l0ZW1OYW1lLHBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvTmFtZSk7XG4gICAgICAgIGNoYW5nZWRQb3J0Zm9saW9JdGVtLnNldFF1YW50aXR5KHF1YW50aXR5KTtcblxuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLnNhdmVQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cblxuICAgIC8qaW5pdGlhbGl6ZVBvcnRmb2xpbygpIHtcbiAgICAgICAgLy9jcmVhdGUgYml0c3RhbXAgcG9ydGZvbGlvIGl0ZW1zXG4gICAgICAgIC8vYml0c3RhbXBMaXRlY29pbnNcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBMaXRlY29pbnNcIixcbiAgICAgICAgICAgIFwiQml0c3RhbXAgLSBMaXRlY29pbnNcIixcbiAgICAgICAgICAgIFwiYml0c3RhbXBcIik7XG5cbiAgICAgICAgLy9iaXRzdGFtcEV1cm9cbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBFdXJvXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gVmVyZsO8Z2JhcmUgRXVyb1wiLFxuICAgICAgICAgICAgXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICAvL2JpdHN0YW1wQlRDXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wQlRDXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gQml0Y29pbnNcIixcbiAgICAgICAgICAgIFwiYml0c3RhbXBcIik7XG5cblxuICAgICAgICAvL2JpdHN0YW1wUmlwcGxlc1xuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcFJpcHBsZXNcIixcbiAgICAgICAgICAgIFwiQml0c3RhbXAgLSBSaXBwbGVzXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG4gICAgICAgIC8vY3JlYXRlIGJpdGZpbmV4IHBvcnRmb2xpbyBpdGVtc1xuICAgICAgICAvL2JpdGZpbmV4SU9UQVxuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leElPVEFcIixcbiAgICAgICAgICAgIFwiQml0ZmluZXggLSBJT1RBXCIsXG4gICAgICAgICAgICBcImJpdGZpbmV4XCIpO1xuXG4gICAgICAgIC8vYml0ZmluZXhCVENcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhCVENcIixcbiAgICAgICAgICAgIFwiQml0ZmluZXggLSBCaXRjb2luc1wiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcblxuICAgICAgICAvL2JpdGZpbmV4RGFzaFxuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leERhc2hcIixcbiAgICAgICAgICAgIFwiQml0ZmluZXggLSBEYXNoXCIsXG4gICAgICAgICAgICBcImJpdGZpbmV4XCIpO1xuICAgIH0qL1xuXG5cbiAgICAvKmluaXRpYWxpemVQcmljZXMoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImx0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIsIFwiTFRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIiwgXCJCVEMvRVVSXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJ4cnBcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiLCBcIlhSUC9FVVJcIik7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIiwgXCJJT1RBL0JUQ1wiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIiwgXCJCVEMvRVVSXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJldGhcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiLCBcIkVUSC9VU0RcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImlvdFwiLCBcImV0aFwiLCBcImJpdGZpbmV4XCIsIFwiSU9UQS9FVEhcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIsIFwiQlRDL1VTRFwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZHNoXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIiwgXCJEU0gvVVNEXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJkc2hcIiwgXCJidGNcIiwgXCJiaXRmaW5leFwiLCBcIkRTSC9CVENcIik7XG5cbiAgICAgICAgdGhpcy5zYXZlUHJpY2VJbmZvcm1hdGlvbigpO1xuICAgIH0qL1xuXG5cbiAgICAvKmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ3VycmVuY3lQcmljZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmNyZWF0ZUN1cnJlbmN5UHJpY2UoZnJvbSwgdG8sIGRlc2NyaXB0aW9uLCBwbGF0Zm9ybSk7XG4gICAgfSovXG5cbiAgICBzYXZlUHJpY2VJbmZvcm1hdGlvbigpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVQcmVzc2VkKCkge1xuICAgICAgICBzd2l0Y2godGhpcy50YWJTZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgLy9jYWxjdWxhdGlvbiBmaWVsZCBzaG91bGQgYmUgY3JlYXRlZFxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jcmVhdGVDYWxjdWxhdGlvblJlc3VsdFwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIC8vcG9ydGZvbGlvIGl0ZW0gc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlUG9ydGZvbGlvSXRlbVwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIC8vY3VycmVuY3kgcHJpY2Ugc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlQ3VycmVuY3lQcmljZVwiXSk7IFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY1Jlc3VsdERlbGV0ZShjYWxjdWxhdGlvblJlc3VsdDogQ2FsY3VsYXRpb25SZXN1bHQpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuZGVsZXRlQ2FsY3VsYXRpb25SZXN1bHQoY2FsY3VsYXRpb25SZXN1bHQpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5zYXZlQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgfVxuXG5cbiAgICBwb3J0Zm9saW9JdGVtRGVsZXRlKHBvcnRmb2xpb0l0ZW06IENvaW5Qb3J0Zm9saW9JdGVtKSB7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZGVsZXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtKTtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG4gICAgfVxuXG4gICAgY3VycmVuY3lQcmljZURlbGV0ZShjdXJyZW5jeVByaWNlOiBDdXJyZW5jeVByaWNlKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZGVsZXRlQ3VycmVuY3lQcmljZShjdXJyZW5jeVByaWNlKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cblxuICAgIG9uVGFiSW5kZXhDaGFuZ2VkKGV2ZW50KSB7XG4gICAgICAgIGlmKHRoaXMudGFiU2VsZWN0ZWRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVCdXR0b25WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvblZpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFkTW9iIGZ1bmN0aW9uc1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHVibGljIGNyZWF0ZUJhbm5lcigpIHtcbiAgICAgICAgLy9kaWZmZXJlbnQgbWFyZ2luIGZvciBpUGhvbmUgWCBiZWNhdXNlIG9mIHRoZSBiaWdnZXIgc2NyZWVuXG4gICAgICAgIGlmIChwbGF0Zm9ybU1vZHVsZS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMgPT09IDI0MzYgJiZcbiAgICAgICAgICAgIHBsYXRmb3JtTW9kdWxlLmRldmljZS5kZXZpY2VUeXBlID09PSBcIlBob25lXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyTWFyZ2luID0gNTA7XG4gICAgICAgIH1cbiAgICAgICAgdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBZG1vYi5jcmVhdGVCYW5uZXIoe1xuICAgICAgICAgICAgICAgIHRlc3Rpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vdGVzdGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaXplOiBBZG1vYi5BRF9TSVpFLlNNQVJUX0JBTk5FUixcbiAgICAgICAgICAgICAgICBpb3NCYW5uZXJJZDogdGhpcy5pb3NCYW5uZXJJZCxcbiAgICAgICAgICAgICAgICAvL2FuZHJvaWRCYW5uZXJJZDogdGhpcy5hbmRyb2lkQmFubmVySWQsXG4gICAgICAgICAgICAgICAgaW9zVGVzdERldmljZUlkczogW1wiOUZFM0M0RTgtQzdEQi00MEVCLUJDQ0QtODRBNDMwNTBFRUFCXCIsIFwiZGVlODgxYjc4YzY3YzY0MjBhYzNjYjQxYWRkNDZhOTRcIl0sXG4gICAgICAgICAgICAgICAgbWFyZ2luczoge1xuICAgICAgICAgICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUJhbm5lciBkb25lXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVCYW5uZXIgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZUludGVyc3RpdGlhbCgpIHtcbiAgICAgICAgdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBZG1vYi5jcmVhdGVJbnRlcnN0aXRpYWwoe1xuICAgICAgICAgICAgICAgIHRlc3Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgaW9zSW50ZXJzdGl0aWFsSWQ6IHRoaXMuaW9zSW50ZXJzdGl0aWFsSWQsXG4gICAgICAgICAgICAgICAgLy9hbmRyb2lkSW50ZXJzdGl0aWFsSWQ6IHRoaXMuYW5kcm9pZEludGVyc3RpdGlhbElkLFxuICAgICAgICAgICAgICAgIGlvc1Rlc3REZXZpY2VJZHM6IFtcIjlGRTNDNEU4LUM3REItNDBFQi1CQ0NELTg0QTQzMDUwRUVBQlwiLCBcImRlZTg4MWI3OGM2N2M2NDIwYWMzY2I0MWFkZDQ2YTk0XCJdXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUludGVyc3RpdGlhbCBkb25lXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVJbnRlcnN0aXRpYWwgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxuXG5cbiAgICAvL2NhbGN1bGF0aW9uc1xuICAgIC8qY2FsY3VsYXRlQWxsKCkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUlPVEFFdXJvVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlRGFzaEV1cm9WaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVEYXNoVVNEKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQlRDSU9UQSgpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUJUQ0V1cm8oKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVCVENVU0QoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVJT1RBVVNEVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlSU9UQVVTRFZpYUVUSCgpO1xuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsRXVyb1ZpYUJUQygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbFVTRFZpYUJUQygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbFVTRFZpYUV0aGVyZXVtKCk7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBbGxCaXRzdGFtcCgpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUlPVEFFdXJvVmlhQlRDKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leElPVEFcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJpb3RcIiwgXCJidGNcIiwgXCJiaXRmaW5leFwiKSkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcImV1clwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNJT1RBRXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZURhc2hFdXJvVmlhQlRDKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leERhc2hcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJkc2hcIiwgXCJidGNcIiwgXCJiaXRmaW5leFwiKSkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcImV1clwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNEYXNoRXVyb1ZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZURhc2hVU0QoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhEYXNoXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiZHNoXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0Rhc2hVU0QgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVCVENFdXJvKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JUQ0V1cm8gPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVCVENVU0QoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhCVENcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQlRDVVNEID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQVVTRFZpYUVUSCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICh0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiZXRoXCIsIFwiYml0ZmluZXhcIikpICogdGhpcy5nZXRDb3Vyc2UoXCJldGhcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjSU9UQVVTRFZpYUVUSCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUlPVEFVU0RWaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4SU9UQVwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0lPVEFVU0RWaWFCVEMgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVBbGxFdXJvVmlhQlRDKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gcGFyc2VGbG9hdCh0aGlzLkNhbGNCVENFdXJvKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjSU9UQUV1cm8pICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNEYXNoRXVyb1ZpYUJUQyk7XG4gICAgICAgIHRoaXMuQ2FsY0FsbEV1cm9WaWFCVEMgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVBbGxVU0RWaWFFdGhlcmV1bSgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjSU9UQVVTRFZpYUVUSCkgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ1VTRCkgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hVU0QpO1xuICAgICAgICB0aGlzLkNhbGNBbGxVU0RWaWFFVEggPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVBbGxVU0RWaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBwYXJzZUZsb2F0KHRoaXMuQ2FsY0lPVEFVU0RWaWFCVEMpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNCVENVU0QpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNEYXNoVVNEKTtcbiAgICAgICAgdGhpcy5DYWxjQWxsVVNEVmlhQlRDID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlQlRDSU9UQSgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leEJUQ1wiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgLyB0aGlzLmdldENvdXJzZShcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNCVENJT1RBID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG5cbiAgICBjYWxjdWxhdGVBbGxCaXRzdGFtcCgpIHtcbiAgICAgICAgbGV0IHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBxdWFudGl0eSAvIHRoaXMuZ2V0Q291cnNlKFwibHRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wTFRDQW1vdW50RVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBFdXJvXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgcmVzdWx0ID0gcXVhbnRpdHkgLyB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcEJUQ0Ftb3VudEV1cm8gPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEV1cm9cIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAvIHRoaXMuZ2V0Q291cnNlKFwieHJwXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wWFJQQW1vdW50RXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wTGl0ZWNvaW5zXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgcmVzdWx0ID0gcXVhbnRpdHkgKiB0aGlzLmdldENvdXJzZShcImx0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcExUQ0VVUiA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wQlRDXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgcmVzdWx0ID0gcXVhbnRpdHkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcEJUQ0VVUiA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wUmlwcGxlc1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIHJlc3VsdCA9IHF1YW50aXR5ICogdGhpcy5nZXRDb3Vyc2UoXCJ4cnBcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBYUlBFVVIgPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICByZXN1bHQgPSBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JpdHN0YW1wQlRDRVVSKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjQml0c3RhbXBMVENFVVIpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNCaXRzdGFtcFhSUEVVUik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQWxsRXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH0qL1xuICAgIFxufSJdfQ==