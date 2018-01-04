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
    //calculations
    ItemsComponent.prototype.calculateAll = function () {
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
    };
    ItemsComponent.prototype.calculateIOTAEuroViaBTC = function () {
        var result = (this.getCoinPortfolioItem("bitfinexIOTA", "bitfinex").getQuantity() * this.getCourse("iot", "btc", "bitfinex")) * this.getCourse("btc", "eur", "bitfinex");
        this.CalcIOTAEuro = result.toString();
    };
    ItemsComponent.prototype.calculateDashEuroViaBTC = function () {
        var result = (this.getCoinPortfolioItem("bitfinexDash", "bitfinex").getQuantity() * this.getCourse("dsh", "btc", "bitfinex")) * this.getCourse("btc", "eur", "bitfinex");
        this.CalcDashEuroViaBTC = result.toString();
    };
    ItemsComponent.prototype.calculateDashUSD = function () {
        var result = this.getCoinPortfolioItem("bitfinexDash", "bitfinex").getQuantity() * this.getCourse("dsh", "usd", "bitfinex");
        this.CalcDashUSD = result.toString();
    };
    ItemsComponent.prototype.calculateBTCEuro = function () {
        var result = this.getCoinPortfolioItem("bitfinexBTC", "bitfinex").getQuantity() * this.getCourse("btc", "eur", "bitfinex");
        this.CalcBTCEuro = result.toString();
    };
    ItemsComponent.prototype.calculateBTCUSD = function () {
        var result = this.getCoinPortfolioItem("bitfinexBTC", "bitfinex").getQuantity() * this.getCourse("btc", "usd", "bitfinex");
        this.CalcBTCUSD = result.toString();
    };
    ItemsComponent.prototype.calculateIOTAUSDViaETH = function () {
        var result = (this.getCoinPortfolioItem("bitfinexIOTA", "bitfinex").getQuantity() * this.getCourse("iot", "eth", "bitfinex")) * this.getCourse("eth", "usd", "bitfinex");
        this.CalcIOTAUSDViaETH = result.toString();
    };
    ItemsComponent.prototype.calculateIOTAUSDViaBTC = function () {
        var result = (this.getCoinPortfolioItem("bitfinexIOTA", "bitfinex").getQuantity() * this.getCourse("iot", "btc", "bitfinex")) * this.getCourse("btc", "usd", "bitfinex");
        this.CalcIOTAUSDViaBTC = result.toString();
    };
    ItemsComponent.prototype.calculateAllEuroViaBTC = function () {
        var result = parseFloat(this.CalcBTCEuro) + parseFloat(this.CalcIOTAEuro) + parseFloat(this.CalcDashEuroViaBTC);
        this.CalcAllEuroViaBTC = result.toString();
    };
    ItemsComponent.prototype.calculateAllUSDViaEthereum = function () {
        var result = parseFloat(this.CalcIOTAUSDViaETH) + parseFloat(this.CalcBTCUSD) + parseFloat(this.CalcDashUSD);
        this.CalcAllUSDViaETH = result.toString();
    };
    ItemsComponent.prototype.calculateAllUSDViaBTC = function () {
        var result = parseFloat(this.CalcIOTAUSDViaBTC) + parseFloat(this.CalcBTCUSD) + parseFloat(this.CalcDashUSD);
        this.CalcAllUSDViaBTC = result.toString();
    };
    ItemsComponent.prototype.calculateBTCIOTA = function () {
        var result = this.getCoinPortfolioItem("bitfinexBTC", "bitfinex").getQuantity() / this.getCourse("iot", "btc", "bitfinex");
        this.CalcBTCIOTA = result.toString();
    };
    ItemsComponent.prototype.calculateAllBitstamp = function () {
        var quantity = this.getCoinPortfolioItem("bitstampEuro", "bitstamp").getQuantity();
        var result = quantity / this.getCourse("ltc", "eur", "bitstamp");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTRFO0FBQzVFLDJFQUE0RDtBQUk1RCwrQ0FBNkM7QUFDN0MsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUN6RSxzRUFBb0U7QUFFcEUsMENBQTRDO0FBQzVDLDZCQUErQjtBQUMvQiwwREFBNEQ7QUFFNUQsMENBQXlDO0FBRXpDLG1EQUFtRDtBQVFuRDtJQXlDSSx3QkFBNkIsV0FBd0IsRUFDeEIsb0JBQTBDLEVBQzFDLE1BQWMsRUFDZCxvQkFBMEMsRUFDMUMsa0JBQXNDO1FBSnRDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQTVDM0Qsa0JBQWEsR0FBNkIsRUFBRSxDQUFDO1FBRTdDLDJCQUFzQixHQUFvQixFQUFFLENBQUM7UUFDN0MsMkJBQXNCLEdBQW9CLEVBQUUsQ0FBQztRQUU3QyxzQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDdkIsMEJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBRTNCLGtCQUFhLEdBQUcsSUFBSSwyQ0FBYSxFQUFFLENBQUM7UUFFcEMscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQ2xDLDhCQUE4QjtRQUM5QiwyREFBMkQ7UUFDM0QsaUVBQWlFO1FBQ3pELGdCQUFXLEdBQVcsd0NBQXdDLENBQUM7UUFDL0Qsc0JBQWlCLEdBQVcsd0NBQXdDLENBQUM7SUE2QjdFLENBQUM7SUFFRCxpQ0FBUSxHQUFSO1FBQUEsaUJBZ0JDO1FBZkcsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVB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O09BN0MxRCxjQUFjLENBdVoxQjtJQUFELHFCQUFDO0NBQUEsQUF2WkQsSUF1WkM7QUF2Wlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XG5cbmltcG9ydCB7IEN1cnJlbmN5UHJpY2UgfSBmcm9tICcuL0N1cnJlbmN5UHJpY2UnO1xuaW1wb3J0IHsgQ29pblBvcnRmb2xpb0l0ZW0gfSBmcm9tICcuL0NvaW5Qb3J0Zm9saW9JdGVtJztcbmltcG9ydCB7IEl0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQb3J0Zm9saW9JdGVtU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL3BvcnRmb2xpby1pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvY3VycmVuY3ktcHJpY2Uuc2VydmljZVwiO1xuaW1wb3J0IHsgQ2FsY3VsYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvY2FsY3VsYXRpb24uc2VydmljZVwiO1xuXG5pbXBvcnQgKiBhcyBBZG1vYiBmcm9tIFwibmF0aXZlc2NyaXB0LWFkbW9iXCI7XG5pbXBvcnQgKiBhcyB0aW1lciBmcm9tIFwidGltZXJcIjtcbmltcG9ydCAqIGFzIHBsYXRmb3JtTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtXCI7XG5cbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcblxuLy9pbXBvcnQgKiBhcyBjb25maWdTZXR0aW5ncyBmcm9tIFwiLi4vY29uZmlnLmpzb25cIjtcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1pdGVtc1wiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9pdGVtcy5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBJdGVtc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcHJpdmF0ZSBjb2luUG9ydGZvbGlvOiBBcnJheTxDb2luUG9ydGZvbGlvSXRlbT4gPSBbXTtcblxuICAgIHByaXZhdGUgY3VycmVuY3lQcmljZXNCaXRzdGFtcDogQ3VycmVuY3lQcmljZVtdID0gW107XG4gICAgcHJpdmF0ZSBjdXJyZW5jeVByaWNlc0JpdGZpbmV4OiBDdXJyZW5jeVByaWNlW10gPSBbXTtcblxuICAgIHByaXZhdGUgY2FsY1Jlc3VsdEdlbmVyYWwgPSBbXTtcbiAgICBwcml2YXRlIGNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IFtdO1xuXG4gICAgcHJpdmF0ZSBzZWN1cmVTdG9yYWdlID0gbmV3IFNlY3VyZVN0b3JhZ2UoKTtcblxuICAgIHByaXZhdGUgdGFiU2VsZWN0ZWRJbmRleDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHRhYkJhck1hcmdpbjogbnVtYmVyID0gNTA7XG4gICAgLy9BZE1vYiBmb3IgQW5kcm9pZCB0byBiZSBkb25lXG4gICAgLy9wcml2YXRlIGFuZHJvaWRCYW5uZXJJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLVhYWFgvWVlZWVwiO1xuICAgIC8vcHJpdmF0ZSBhbmRyb2lkSW50ZXJzdGl0aWFsSWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi1LS0tLL0xMTExcIjtcbiAgICBwcml2YXRlIGlvc0Jhbm5lcklkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItMzcwNDQzOTA4NTAzMjA4Mi8zODYzOTAzMjUyXCI7XG4gICAgcHJpdmF0ZSBpb3NJbnRlcnN0aXRpYWxJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLTM3MDQ0MzkwODUwMzIwODIvNjIxMjQ3OTM5NFwiO1xuICAgIFxuXG4gICAgQ2FsY0lPVEFFdXJvOiBzdHJpbmc7XG4gICAgQ2FsY0lPVEFVU0RWaWFFVEg6IHN0cmluZztcbiAgICBDYWxjSU9UQVVTRFZpYUJUQzogc3RyaW5nO1xuICAgIENhbGNEYXNoRXVyb1ZpYUJUQzogc3RyaW5nO1xuICAgIENhbGNEYXNoVVNEOiBzdHJpbmc7XG4gICAgQ2FsY0JUQ0V1cm86IHN0cmluZztcbiAgICBDYWxjQlRDVVNEOiBzdHJpbmc7XG4gICAgQ2FsY0JUQ0lPVEE6IHN0cmluZztcbiAgICBDYWxjQWxsRXVyb1ZpYUJUQzogc3RyaW5nO1xuICAgIENhbGNBbGxVU0RWaWFFVEg6IHN0cmluZztcbiAgICBDYWxjQWxsVVNEVmlhQlRDOiBzdHJpbmc7XG5cbiAgICBDYWxjQml0c3RhbXBMVENBbW91bnRFVVI6IHN0cmluZztcbiAgICBDYWxjQml0c3RhbXBCVENBbW91bnRFdXJvOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wWFJQQW1vdW50RXVybzogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcExUQ0VVUjogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcEJUQ0VVUjogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcFhSUEVVUjogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcEFsbEV1cm86IHN0cmluZztcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBwb3J0Zm9saW9JdGVtU2VydmljZTogUG9ydGZvbGlvSXRlbVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGN1cnJlbmN5UHJpY2VTZXJ2aWNlOiBDdXJyZW5jeVByaWNlU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNhbGN1bGF0aW9uU2VydmljZTogQ2FsY3VsYXRpb25TZXJ2aWNlKSB7XG4gICAgfVxuICAgIFxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICAvL2luaXRpYWxpemUgYnVmZmVyc1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmxvYWRQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5sb2FkQ3VycmVuY3lQcmljZXMoKTtcblxuICAgICAgICB0aGlzLnJlZnJlc2hQb3J0Zm9saW8oKTtcbiAgICAgICAgLy90aGlzIG1ldGhvZCBvbmx5IHJlZnJlc2hlcyB0aGUgY3VycmVuY3kgcHJpY2UgZGF0YSBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlID0+IHRvIGhhdmUgdGhlIGFjdHVhbCBwcmljZXMgcmVmcmVzaCBvbiB0aGUgZGF0YSBoYXMgdG8gYmUgcGVyZm9ybWVkXG4gICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpO1xuXG4gICAgICAgIC8vcmVhZCBkYXRhIGZyb20gdGhlIHJlc3BlY3RpdmUgcGxhdGZvcm1zXG4gICAgICAgIGxldCBwcm9taXNlQml0ZmluZXggPSB0aGlzLnJlZnJlc2hCaXRmaW5leERhdGEoKTtcbiAgICAgICAgbGV0IHByb21pc2VCaXRzdGFtcCA9IHRoaXMucmVmcmVzaEJpdHN0YW1wRGF0YSgpO1xuXG4gICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVSZXN1bHRzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgLy90aGlzLmNyZWF0ZUludGVyc3RpdGlhbCgpO1xuICAgICAgICAvL3RoaXMuY3JlYXRlQmFubmVyKCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBkYXRhIHJlZnJlc2ggbG9naWNcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIG9uUmVmcmVzaFRyaWdnZXJlZChldmVudCkge1xuICAgICAgICB2YXIgcHVsbFRvUmVmcmVzaCA9IGV2ZW50Lm9iamVjdDtcblxuICAgICAgICB0aGlzLnJlZnJlc2hBbGwocHVsbFRvUmVmcmVzaCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEFsbChwdWxsVG9SZWZyZXNoKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFBvcnRmb2xpbygpO1xuICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcblxuICAgICAgICBsZXQgcHJvbWlzZUJpdGZpbmV4ID0gdGhpcy5yZWZyZXNoQml0ZmluZXhEYXRhKCk7XG4gICAgICAgIGxldCBwcm9taXNlQml0c3RhbXAgPSB0aGlzLnJlZnJlc2hCaXRzdGFtcERhdGEoKTtcblxuICAgICAgICBQcm9taXNlLmFsbChbcHJvbWlzZUJpdGZpbmV4LCBwcm9taXNlQml0c3RhbXBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlUmVzdWx0cygpO1xuICAgICAgICAgICAgcHVsbFRvUmVmcmVzaC5yZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZnJlc2hCaXRzdGFtcERhdGEoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZXMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0c3RhbXBcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLml0ZW1TZXJ2aWNlLmxvYWREYXRhRnJvbUJpdHN0YW1wV2l0aFN5bWJvbChjdXJyZW5jeVByaWNlc1tpXSk7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZnJlc2hCaXRmaW5leERhdGEoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZXMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0ZmluZXhcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLml0ZW1TZXJ2aWNlLmxvYWREYXRhRnJvbUJpdGZpbmV4V2l0aFN5bWJvbChjdXJyZW5jeVByaWNlc1tpXSk7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcmVmcmVzaFBvcnRmb2xpbygpIHtcbiAgICAgICAgdGhpcy5jb2luUG9ydGZvbGlvID0gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5nZXRBbGxQb3J0Zm9saW9JdGVtcygpO1xuICAgIH1cblxuICAgIHJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNCaXRmaW5leCA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0JpdHN0YW1wID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdHN0YW1wXCIpO1xuICAgIH1cblxuICAgIHJlZnJlc2hNYWludGFpbmVkQ2FsY3VsYXRpb25SZXN1bHRzKCkge1xuICAgICAgICB0aGlzLmNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IHRoaXMuY2FsY3VsYXRpb25TZXJ2aWNlLmdldEFsbENhbGN1bGF0aW9uUmVzdWx0cygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVJlc3VsdHMoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRpb25TZXJ2aWNlLmNhbGN1bGF0ZUFsbFJlc3VsdHMoKTtcbiAgICAgICAgdGhpcy5jYWxjUmVzdWx0c1BvcnRmb2xpb3MgPSB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5nZXRBbGxDYWxjdWxhdGlvblJlc3VsdHMoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9FTkQ6IGRhdGEgcmVmcmVzaCBsb2dpY1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICBnZXRDb3Vyc2UoZnJvbSwgdG8sIHBsYXRmb3JtKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0Q3VycmVuY3lQcmljZUFtb3VudChmcm9tLCB0bywgcGxhdGZvcm0pO1xuICAgIH1cblxuICAgIGdldFF1YW50aXR5KHBvcnRmb2xpb0l0ZW06IENvaW5Qb3J0Zm9saW9JdGVtKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBwb3J0Zm9saW9JdGVtLmdldFF1YW50aXR5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGdldENvaW5Qb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lOiBzdHJpbmcsIHBvcnRmb2xpbzogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5nZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW8pO1xuICAgIH1cblxuXG4gICAgY3JlYXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb246IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcsIHN5bWJvbDogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5jcmVhdGVQb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24sIDAsIHBvcnRmb2xpbywgc3ltYm9sKTtcbiAgICB9XG5cbiAgICBvblBvcnRmb2xpb0l0ZW1RdWFudGl0eUNoYW5nZShxdWFudGl0eSwgcG9ydGZvbGlvSXRlbSkge1xuICAgICAgICBsZXQgY2hhbmdlZFBvcnRmb2xpb0l0ZW0gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUocG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSxwb3J0Zm9saW9JdGVtLnBvcnRmb2xpb05hbWUpO1xuICAgICAgICBjaGFuZ2VkUG9ydGZvbGlvSXRlbS5zZXRRdWFudGl0eShxdWFudGl0eSk7XG5cbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuXG5cbiAgICAvKmluaXRpYWxpemVQb3J0Zm9saW8oKSB7XG4gICAgICAgIC8vY3JlYXRlIGJpdHN0YW1wIHBvcnRmb2xpbyBpdGVtc1xuICAgICAgICAvL2JpdHN0YW1wTGl0ZWNvaW5zXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wTGl0ZWNvaW5zXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gTGl0ZWNvaW5zXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG4gICAgICAgIC8vYml0c3RhbXBFdXJvXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLFxuICAgICAgICAgICAgXCJCaXRzdGFtcCAtIFZlcmbDvGdiYXJlIEV1cm9cIixcbiAgICAgICAgICAgIFwiYml0c3RhbXBcIik7XG5cbiAgICAgICAgLy9iaXRzdGFtcEJUQ1xuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEJUQ1wiLFxuICAgICAgICAgICAgXCJCaXRzdGFtcCAtIEJpdGNvaW5zXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG5cbiAgICAgICAgLy9iaXRzdGFtcFJpcHBsZXNcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBSaXBwbGVzXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gUmlwcGxlc1wiLFxuICAgICAgICAgICAgXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICAvL2NyZWF0ZSBiaXRmaW5leCBwb3J0Zm9saW8gaXRlbXNcbiAgICAgICAgLy9iaXRmaW5leElPVEFcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gSU9UQVwiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcblxuICAgICAgICAvL2JpdGZpbmV4QlRDXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gQml0Y29pbnNcIixcbiAgICAgICAgICAgIFwiYml0ZmluZXhcIik7XG5cbiAgICAgICAgLy9iaXRmaW5leERhc2hcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhEYXNoXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gRGFzaFwiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcbiAgICB9Ki9cblxuXG4gICAgLyppbml0aWFsaXplUHJpY2VzKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJsdGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiLCBcIkxUQy9FVVJcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIsIFwiQlRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwieHJwXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIiwgXCJYUlAvRVVSXCIpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIsIFwiSU9UQS9CVENcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcImV1clwiLCBcImJpdGZpbmV4XCIsIFwiQlRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZXRoXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIiwgXCJFVEgvVVNEXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJpb3RcIiwgXCJldGhcIiwgXCJiaXRmaW5leFwiLCBcIklPVEEvRVRIXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJidGNcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiLCBcIkJUQy9VU0RcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImRzaFwiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIsIFwiRFNIL1VTRFwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZHNoXCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIiwgXCJEU0gvQlRDXCIpO1xuXG4gICAgICAgIHRoaXMuc2F2ZVByaWNlSW5mb3JtYXRpb24oKTtcbiAgICB9Ki9cblxuXG4gICAgLypjcmVhdGVQcmljZUluZm9ybWF0aW9uKGZyb206IHN0cmluZywgdG86IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IEN1cnJlbmN5UHJpY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5jcmVhdGVDdXJyZW5jeVByaWNlKGZyb20sIHRvLCBkZXNjcmlwdGlvbiwgcGxhdGZvcm0pO1xuICAgIH0qL1xuXG4gICAgc2F2ZVByaWNlSW5mb3JtYXRpb24oKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUHJlc3NlZCgpIHtcbiAgICAgICAgc3dpdGNoKHRoaXMudGFiU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIC8vY2FsY3VsYXRpb24gZmllbGQgc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlQ2FsY3VsYXRpb25SZXN1bHRcIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiBcbiAgICAgICAgICAgICAgICAvL3BvcnRmb2xpbyBpdGVtIHNob3VsZCBiZSBjcmVhdGVkXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWF0ZVBvcnRmb2xpb0l0ZW1cIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiBcbiAgICAgICAgICAgICAgICAvL2N1cnJlbmN5IHByaWNlIHNob3VsZCBiZSBjcmVhdGVkICAgXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWF0ZUN1cnJlbmN5UHJpY2VcIl0pOyBcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBZE1vYiBmdW5jdGlvbnNcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHB1YmxpYyBjcmVhdGVCYW5uZXIoKSB7XG4gICAgICAgIC8vZGlmZmVyZW50IG1hcmdpbiBmb3IgaVBob25lIFggYmVjYXVzZSBvZiB0aGUgYmlnZ2VyIHNjcmVlblxuICAgICAgICBpZiAocGxhdGZvcm1Nb2R1bGUuc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0UGl4ZWxzID09PSAyNDM2ICYmXG4gICAgICAgICAgICBwbGF0Zm9ybU1vZHVsZS5kZXZpY2UuZGV2aWNlVHlwZSA9PT0gXCJQaG9uZVwiKSB7XG4gICAgICAgICAgICB0aGlzLnRhYkJhck1hcmdpbiA9IDUwO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVyLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQWRtb2IuY3JlYXRlQmFubmVyKHtcbiAgICAgICAgICAgICAgICB0ZXN0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvL3Rlc3Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgc2l6ZTogQWRtb2IuQURfU0laRS5TTUFSVF9CQU5ORVIsXG4gICAgICAgICAgICAgICAgaW9zQmFubmVySWQ6IHRoaXMuaW9zQmFubmVySWQsXG4gICAgICAgICAgICAgICAgLy9hbmRyb2lkQmFubmVySWQ6IHRoaXMuYW5kcm9pZEJhbm5lcklkLFxuICAgICAgICAgICAgICAgIGlvc1Rlc3REZXZpY2VJZHM6IFtcIjlGRTNDNEU4LUM3REItNDBFQi1CQ0NELTg0QTQzMDUwRUVBQlwiLCBcImRlZTg4MWI3OGM2N2M2NDIwYWMzY2I0MWFkZDQ2YTk0XCJdLFxuICAgICAgICAgICAgICAgIG1hcmdpbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVCYW5uZXIgZG9uZVwiKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlQmFubmVyIGVycm9yOiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVJbnRlcnN0aXRpYWwoKSB7XG4gICAgICAgIHRpbWVyLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQWRtb2IuY3JlYXRlSW50ZXJzdGl0aWFsKHtcbiAgICAgICAgICAgICAgICB0ZXN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlvc0ludGVyc3RpdGlhbElkOiB0aGlzLmlvc0ludGVyc3RpdGlhbElkLFxuICAgICAgICAgICAgICAgIC8vYW5kcm9pZEludGVyc3RpdGlhbElkOiB0aGlzLmFuZHJvaWRJbnRlcnN0aXRpYWxJZCxcbiAgICAgICAgICAgICAgICBpb3NUZXN0RGV2aWNlSWRzOiBbXCI5RkUzQzRFOC1DN0RCLTQwRUItQkNDRC04NEE0MzA1MEVFQUJcIiwgXCJkZWU4ODFiNzhjNjdjNjQyMGFjM2NiNDFhZGQ0NmE5NFwiXVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVJbnRlcnN0aXRpYWwgZG9uZVwiKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlSW50ZXJzdGl0aWFsIGVycm9yOiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgIH1cblxuXG4gICAgLy9jYWxjdWxhdGlvbnNcbiAgICBjYWxjdWxhdGVBbGwoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlSU9UQUV1cm9WaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVEYXNoRXVyb1ZpYUJUQygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZURhc2hVU0QoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVCVENJT1RBKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQlRDRXVybygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUJUQ1VTRCgpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUlPVEFVU0RWaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVJT1RBVVNEVmlhRVRIKCk7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBbGxFdXJvVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsVVNEVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsVVNEVmlhRXRoZXJldW0oKTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbEJpdHN0YW1wKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQUV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4SU9UQVwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0lPVEFFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlRGFzaEV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4RGFzaFwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImRzaFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0Rhc2hFdXJvVmlhQlRDID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlRGFzaFVTRCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leERhc2hcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJkc2hcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjRGFzaFVTRCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ0V1cm8oKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhCVENcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJldXJcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQlRDRXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ1VTRCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leEJUQ1wiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNCVENVU0QgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVJT1RBVVNEVmlhRVRIKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leElPVEFcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJpb3RcIiwgXCJldGhcIiwgXCJiaXRmaW5leFwiKSkgKiB0aGlzLmdldENvdXJzZShcImV0aFwiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNJT1RBVVNEVmlhRVRIID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQVVTRFZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICh0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIikpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjSU9UQVVTRFZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbEV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ0V1cm8pICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBRXVybykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hFdXJvVmlhQlRDKTtcbiAgICAgICAgdGhpcy5DYWxjQWxsRXVyb1ZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbFVTRFZpYUV0aGVyZXVtKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBVVNEVmlhRVRIKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjQlRDVVNEKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjRGFzaFVTRCk7XG4gICAgICAgIHRoaXMuQ2FsY0FsbFVTRFZpYUVUSCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbFVTRFZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjSU9UQVVTRFZpYUJUQykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ1VTRCkgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hVU0QpO1xuICAgICAgICB0aGlzLkNhbGNBbGxVU0RWaWFCVEMgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVCVENJT1RBKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAvIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JUQ0lPVEEgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cblxuICAgIGNhbGN1bGF0ZUFsbEJpdHN0YW1wKCkge1xuICAgICAgICBsZXQgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBFdXJvXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJsdGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBMVENBbW91bnRFVVIgPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEV1cm9cIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAvIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQlRDQW1vdW50RXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJ4cnBcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBYUlBBbW91bnRFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBMaXRlY29pbnNcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwibHRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wTFRDRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBCVENcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQlRDRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBSaXBwbGVzXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgcmVzdWx0ID0gcXVhbnRpdHkgKiB0aGlzLmdldENvdXJzZShcInhycFwiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcFhSUEVVUiA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjQml0c3RhbXBCVENFVVIpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNCaXRzdGFtcExUQ0VVUikgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JpdHN0YW1wWFJQRVVSKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBBbGxFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxufSJdfQ==