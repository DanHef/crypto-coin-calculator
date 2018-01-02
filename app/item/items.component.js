"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var item_service_1 = require("./item.service");
var portfolio_item_service_1 = require("./services/portfolio-item.service");
var currency_price_service_1 = require("./services/currency-price.service");
var Admob = require("nativescript-admob");
var timer = require("timer");
var platformModule = require("tns-core-modules/platform");
var router_1 = require("@angular/router");
//import * as configSettings from "../config.json";
var ItemsComponent = (function () {
    function ItemsComponent(itemService, portfolioItemService, router, currencyPriceService) {
        this.itemService = itemService;
        this.portfolioItemService = portfolioItemService;
        this.router = router;
        this.currencyPriceService = currencyPriceService;
        this.currencyPricesBitstamp = [];
        this.currencyPricesBitfinex = [];
        this.tabSelectedIndex = 0;
        this.coinPortfolio = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
        //private androidBannerId: string = "ca-app-pub-XXXX/YYYY";
        //private androidInterstitialId: string = "ca-app-pub-KKKK/LLLL";
        this.iosBannerId = "ca-app-pub-3704439085032082/3863903252";
        this.iosInterstitialId = "ca-app-pub-3704439085032082/6212479394";
        this.tabBarMargin = 50;
    }
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
    ItemsComponent.prototype.ngOnInit = function () {
        //initialize buffers
        this.portfolioItemService.loadPortfolio();
        this.currencyPriceService.loadCurrencyPrices();
        this.refreshPortfolio();
        this.refreshCurrencyPrices();
        //this.initializePortfolio();
        //this.initializePrices();
        //this.readSecureStorage();
        this.refreshBitfinexData();
        this.refreshBitstampData();
    };
    ItemsComponent.prototype.ngAfterViewInit = function () {
        //this.createInterstitial();
        //this.createBanner();
    };
    //------------------------
    //data refresh logic
    //------------------------
    ItemsComponent.prototype.onRefreshTriggered = function (event) {
        var pullToRefresh = event.object;
        this.refreshAll(pullToRefresh);
    };
    ItemsComponent.prototype.refreshAll = function (pullToRefresh) {
        this.refreshPortfolio();
        this.refreshCurrencyPrices();
        var promiseBitfinex = this.refreshBitfinexData();
        var promiseBitstamp = this.refreshBitstampData();
        Promise.all([promiseBitfinex, promiseBitstamp]).then(function () {
            pullToRefresh.refreshing = false;
        });
    };
    ItemsComponent.prototype.refreshBitstampData = function () {
        var _this = this;
        var promises = [];
        var currencyPrices = this.currencyPriceService.getAllCurrencyPrices("bitstamp");
        for (var i = 0; i < currencyPrices.length; i++) {
            var promise = this.itemService.loadDataFromBitstampWithSymbol(currencyPrices[i]);
            promises.push(promise);
        }
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function () {
                _this.calculateAll();
                resolve(true);
            });
        });
    };
    ItemsComponent.prototype.refreshBitfinexData = function () {
        var _this = this;
        var promises = [];
        var currencyPrices = this.currencyPriceService.getAllCurrencyPrices("bitfinex");
        for (var i = 0; i < currencyPrices.length; i++) {
            var promise = this.itemService.loadDataFromBitfinexWithSymbol(currencyPrices[i]);
            promises.push(promise);
        }
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function () {
                _this.calculateAll();
                resolve(true);
            });
        });
    };
    ItemsComponent.prototype.refreshPortfolio = function () {
        this.coinPortfolio = this.portfolioItemService.getAllPortfolioItems();
    };
    ItemsComponent.prototype.refreshCurrencyPrices = function () {
        this.currencyPricesBitfinex = this.currencyPriceService.getAllCurrencyPrices("bitfinex");
        this.currencyPricesBitstamp = this.currencyPriceService.getAllCurrencyPrices("bitstamp");
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
            currency_price_service_1.CurrencyPriceService])
    ], ItemsComponent);
    return ItemsComponent;
}());
exports.ItemsComponent = ItemsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTRFO0FBQzVFLDJFQUE0RDtBQUk1RCwrQ0FBNkM7QUFDN0MsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUV6RSwwQ0FBNEM7QUFDNUMsNkJBQStCO0FBQy9CLDBEQUE0RDtBQUU1RCwwQ0FBeUM7QUFFekMsbURBQW1EO0FBUW5EO0lBcUNJLHdCQUE2QixXQUF3QixFQUN4QixvQkFBMEMsRUFDMUMsTUFBYyxFQUNkLG9CQUEwQztRQUgxQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBdkN2RSwyQkFBc0IsR0FBb0IsRUFBRSxDQUFDO1FBQzdDLDJCQUFzQixHQUFvQixFQUFFLENBQUM7UUFFN0MscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBc0I3QixrQkFBYSxHQUE2QixFQUFFLENBQUM7UUFHN0Msa0JBQWEsR0FBRyxJQUFJLDJDQUFhLEVBQUUsQ0FBQztRQUVwQywyREFBMkQ7UUFDM0QsaUVBQWlFO1FBQ3pELGdCQUFXLEdBQVcsd0NBQXdDLENBQUM7UUFDL0Qsc0JBQWlCLEdBQVcsd0NBQXdDLENBQUM7UUFDckUsaUJBQVksR0FBVyxFQUFFLENBQUM7SUFNbEMsQ0FBQztJQUdNLHFDQUFZLEdBQW5CO1FBQ0ksNERBQTREO1FBQzVELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksS0FBSyxJQUFJO1lBQ3RELGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUNE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SCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pELENBQUM7SUE5WFEsY0FBYztRQUwxQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx3QkFBd0I7U0FDeEMsQ0FBQzt5Q0FzQzRDLDBCQUFXO1lBQ0YsNkNBQW9CO1lBQ2xDLGVBQU07WUFDUSw2Q0FBb0I7T0F4QzlELGNBQWMsQ0ErWDFCO0lBQUQscUJBQUM7Q0FBQSxBQS9YRCxJQStYQztBQS9YWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgU2VjdXJlU3RvcmFnZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc2VjdXJlLXN0b3JhZ2VcIjtcblxuaW1wb3J0IHsgQ3VycmVuY3lQcmljZSB9IGZyb20gJy4vQ3VycmVuY3lQcmljZSc7XG5pbXBvcnQgeyBDb2luUG9ydGZvbGlvSXRlbSB9IGZyb20gJy4vQ29pblBvcnRmb2xpb0l0ZW0nO1xuaW1wb3J0IHsgSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvcG9ydGZvbGlvLWl0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgQ3VycmVuY3lQcmljZVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5cbmltcG9ydCAqIGFzIEFkbW9iIGZyb20gXCJuYXRpdmVzY3JpcHQtYWRtb2JcIjtcbmltcG9ydCAqIGFzIHRpbWVyIGZyb20gXCJ0aW1lclwiO1xuaW1wb3J0ICogYXMgcGxhdGZvcm1Nb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm1cIjtcblxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuXG4vL2ltcG9ydCAqIGFzIGNvbmZpZ1NldHRpbmdzIGZyb20gXCIuLi9jb25maWcuanNvblwiO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWl0ZW1zXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2l0ZW1zLmNvbXBvbmVudC5odG1sXCIsXG59KVxuZXhwb3J0IGNsYXNzIEl0ZW1zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgICBjdXJyZW5jeVByaWNlc0JpdHN0YW1wOiBDdXJyZW5jeVByaWNlW10gPSBbXTtcbiAgICBjdXJyZW5jeVByaWNlc0JpdGZpbmV4OiBDdXJyZW5jeVByaWNlW10gPSBbXTtcblxuICAgIHRhYlNlbGVjdGVkSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBDYWxjSU9UQUV1cm86IHN0cmluZztcbiAgICBDYWxjSU9UQVVTRFZpYUVUSDogc3RyaW5nO1xuICAgIENhbGNJT1RBVVNEVmlhQlRDOiBzdHJpbmc7XG4gICAgQ2FsY0Rhc2hFdXJvVmlhQlRDOiBzdHJpbmc7XG4gICAgQ2FsY0Rhc2hVU0Q6IHN0cmluZztcbiAgICBDYWxjQlRDRXVybzogc3RyaW5nO1xuICAgIENhbGNCVENVU0Q6IHN0cmluZztcbiAgICBDYWxjQlRDSU9UQTogc3RyaW5nO1xuICAgIENhbGNBbGxFdXJvVmlhQlRDOiBzdHJpbmc7XG4gICAgQ2FsY0FsbFVTRFZpYUVUSDogc3RyaW5nO1xuICAgIENhbGNBbGxVU0RWaWFCVEM6IHN0cmluZztcblxuICAgIENhbGNCaXRzdGFtcExUQ0Ftb3VudEVVUjogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcEJUQ0Ftb3VudEV1cm86IHN0cmluZztcbiAgICBDYWxjQml0c3RhbXBYUlBBbW91bnRFdXJvOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wTFRDRVVSOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wQlRDRVVSOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wWFJQRVVSOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wQWxsRXVybzogc3RyaW5nO1xuXG4gICAgY29pblBvcnRmb2xpbzogQXJyYXk8Q29pblBvcnRmb2xpb0l0ZW0+ID0gW107XG5cblxuICAgIHNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuXG4gICAgLy9wcml2YXRlIGFuZHJvaWRCYW5uZXJJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLVhYWFgvWVlZWVwiO1xuICAgIC8vcHJpdmF0ZSBhbmRyb2lkSW50ZXJzdGl0aWFsSWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi1LS0tLL0xMTExcIjtcbiAgICBwcml2YXRlIGlvc0Jhbm5lcklkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItMzcwNDQzOTA4NTAzMjA4Mi8zODYzOTAzMjUyXCI7XG4gICAgcHJpdmF0ZSBpb3NJbnRlcnN0aXRpYWxJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLTM3MDQ0MzkwODUwMzIwODIvNjIxMjQ3OTM5NFwiO1xuICAgIHByaXZhdGUgdGFiQmFyTWFyZ2luOiBudW1iZXIgPSA1MDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaXRlbVNlcnZpY2U6IEl0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjdXJyZW5jeVByaWNlU2VydmljZTogQ3VycmVuY3lQcmljZVNlcnZpY2UpIHtcbiAgICB9XG4gICAgXG5cbiAgICBwdWJsaWMgY3JlYXRlQmFubmVyKCkge1xuICAgICAgICAvL2RpZmZlcmVudCBtYXJnaW4gZm9yIGlQaG9uZSBYIGJlY2F1c2Ugb2YgdGhlIGJpZ2dlciBzY3JlZW5cbiAgICAgICAgaWYgKHBsYXRmb3JtTW9kdWxlLnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodFBpeGVscyA9PT0gMjQzNiAmJlxuICAgICAgICAgICAgcGxhdGZvcm1Nb2R1bGUuZGV2aWNlLmRldmljZVR5cGUgPT09IFwiUGhvbmVcIikge1xuICAgICAgICAgICAgdGhpcy50YWJCYXJNYXJnaW4gPSA1MDtcbiAgICAgICAgfVxuICAgICAgICB0aW1lci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEFkbW9iLmNyZWF0ZUJhbm5lcih7XG4gICAgICAgICAgICAgICAgdGVzdGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy90ZXN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNpemU6IEFkbW9iLkFEX1NJWkUuU01BUlRfQkFOTkVSLFxuICAgICAgICAgICAgICAgIGlvc0Jhbm5lcklkOiB0aGlzLmlvc0Jhbm5lcklkLFxuICAgICAgICAgICAgICAgIC8vYW5kcm9pZEJhbm5lcklkOiB0aGlzLmFuZHJvaWRCYW5uZXJJZCxcbiAgICAgICAgICAgICAgICBpb3NUZXN0RGV2aWNlSWRzOiBbXCI5RkUzQzRFOC1DN0RCLTQwRUItQkNDRC04NEE0MzA1MEVFQUJcIiwgXCJkZWU4ODFiNzhjNjdjNjQyMGFjM2NiNDFhZGQ0NmE5NFwiXSxcbiAgICAgICAgICAgICAgICBtYXJnaW5zOiB7XG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlQmFubmVyIGRvbmVcIik7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUJhbm5lciBlcnJvcjogXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlSW50ZXJzdGl0aWFsKCkge1xuICAgICAgICB0aW1lci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEFkbW9iLmNyZWF0ZUludGVyc3RpdGlhbCh7XG4gICAgICAgICAgICAgICAgdGVzdGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpb3NJbnRlcnN0aXRpYWxJZDogdGhpcy5pb3NJbnRlcnN0aXRpYWxJZCxcbiAgICAgICAgICAgICAgICAvL2FuZHJvaWRJbnRlcnN0aXRpYWxJZDogdGhpcy5hbmRyb2lkSW50ZXJzdGl0aWFsSWQsXG4gICAgICAgICAgICAgICAgaW9zVGVzdERldmljZUlkczogW1wiOUZFM0M0RTgtQzdEQi00MEVCLUJDQ0QtODRBNDMwNTBFRUFCXCIsIFwiZGVlODgxYjc4YzY3YzY0MjBhYzNjYjQxYWRkNDZhOTRcIl1cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlSW50ZXJzdGl0aWFsIGRvbmVcIik7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUludGVyc3RpdGlhbCBlcnJvcjogXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICB9XG5cbiAgICBcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy9pbml0aWFsaXplIGJ1ZmZlcnNcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5sb2FkUG9ydGZvbGlvKCk7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UubG9hZEN1cnJlbmN5UHJpY2VzKCk7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoUG9ydGZvbGlvKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaEN1cnJlbmN5UHJpY2VzKCk7XG4gICAgICAgIC8vdGhpcy5pbml0aWFsaXplUG9ydGZvbGlvKCk7XG4gICAgICAgIC8vdGhpcy5pbml0aWFsaXplUHJpY2VzKCk7XG4gICAgICAgIC8vdGhpcy5yZWFkU2VjdXJlU3RvcmFnZSgpO1xuICAgICAgICB0aGlzLnJlZnJlc2hCaXRmaW5leERhdGEoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoQml0c3RhbXBEYXRhKCk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICAvL3RoaXMuY3JlYXRlSW50ZXJzdGl0aWFsKCk7XG4gICAgICAgIC8vdGhpcy5jcmVhdGVCYW5uZXIoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vZGF0YSByZWZyZXNoIGxvZ2ljXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBvblJlZnJlc2hUcmlnZ2VyZWQoZXZlbnQpIHtcbiAgICAgICAgdmFyIHB1bGxUb1JlZnJlc2ggPSBldmVudC5vYmplY3Q7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoQWxsKHB1bGxUb1JlZnJlc2gpO1xuICAgIH1cblxuICAgIHJlZnJlc2hBbGwocHVsbFRvUmVmcmVzaCkge1xuICAgICAgICB0aGlzLnJlZnJlc2hQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoQ3VycmVuY3lQcmljZXMoKTtcblxuICAgICAgICBsZXQgcHJvbWlzZUJpdGZpbmV4ID0gdGhpcy5yZWZyZXNoQml0ZmluZXhEYXRhKCk7XG4gICAgICAgIGxldCBwcm9taXNlQml0c3RhbXAgPSB0aGlzLnJlZnJlc2hCaXRzdGFtcERhdGEoKTtcblxuICAgICAgICBQcm9taXNlLmFsbChbcHJvbWlzZUJpdGZpbmV4LCBwcm9taXNlQml0c3RhbXBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHB1bGxUb1JlZnJlc2gucmVmcmVzaGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZWZyZXNoQml0c3RhbXBEYXRhKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2VzID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdHN0YW1wXCIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5pdGVtU2VydmljZS5sb2FkRGF0YUZyb21CaXRzdGFtcFdpdGhTeW1ib2woY3VycmVuY3lQcmljZXNbaV0pO1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVBbGwoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZnJlc2hCaXRmaW5leERhdGEoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZXMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0ZmluZXhcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLml0ZW1TZXJ2aWNlLmxvYWREYXRhRnJvbUJpdGZpbmV4V2l0aFN5bWJvbChjdXJyZW5jeVByaWNlc1tpXSk7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbCgpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICByZWZyZXNoUG9ydGZvbGlvKCkge1xuICAgICAgICB0aGlzLmNvaW5Qb3J0Zm9saW8gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldEFsbFBvcnRmb2xpb0l0ZW1zKCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEN1cnJlbmN5UHJpY2VzKCkge1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQml0ZmluZXggPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNCaXRzdGFtcCA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRzdGFtcFwiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9FTkQ6IGRhdGEgcmVmcmVzaCBsb2dpY1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICBnZXRDb3Vyc2UoZnJvbSwgdG8sIHBsYXRmb3JtKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0Q3VycmVuY3lQcmljZUFtb3VudChmcm9tLCB0bywgcGxhdGZvcm0pO1xuICAgIH1cblxuICAgIGdldFF1YW50aXR5KHBvcnRmb2xpb0l0ZW06IENvaW5Qb3J0Zm9saW9JdGVtKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBwb3J0Zm9saW9JdGVtLmdldFF1YW50aXR5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGdldENvaW5Qb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lOiBzdHJpbmcsIHBvcnRmb2xpbzogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5nZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW8pO1xuICAgIH1cblxuXG4gICAgY3JlYXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb246IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcsIHN5bWJvbDogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5jcmVhdGVQb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24sIDAsIHBvcnRmb2xpbywgc3ltYm9sKTtcbiAgICB9XG5cbiAgICBvblBvcnRmb2xpb0l0ZW1RdWFudGl0eUNoYW5nZShxdWFudGl0eSwgcG9ydGZvbGlvSXRlbSkge1xuICAgICAgICBsZXQgY2hhbmdlZFBvcnRmb2xpb0l0ZW0gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUocG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSxwb3J0Zm9saW9JdGVtLnBvcnRmb2xpb05hbWUpO1xuICAgICAgICBjaGFuZ2VkUG9ydGZvbGlvSXRlbS5zZXRRdWFudGl0eShxdWFudGl0eSk7XG5cbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG4gICAgfVxuXG5cbiAgICAvKmluaXRpYWxpemVQb3J0Zm9saW8oKSB7XG4gICAgICAgIC8vY3JlYXRlIGJpdHN0YW1wIHBvcnRmb2xpbyBpdGVtc1xuICAgICAgICAvL2JpdHN0YW1wTGl0ZWNvaW5zXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wTGl0ZWNvaW5zXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gTGl0ZWNvaW5zXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG4gICAgICAgIC8vYml0c3RhbXBFdXJvXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLFxuICAgICAgICAgICAgXCJCaXRzdGFtcCAtIFZlcmbDvGdiYXJlIEV1cm9cIixcbiAgICAgICAgICAgIFwiYml0c3RhbXBcIik7XG5cbiAgICAgICAgLy9iaXRzdGFtcEJUQ1xuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEJUQ1wiLFxuICAgICAgICAgICAgXCJCaXRzdGFtcCAtIEJpdGNvaW5zXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG5cbiAgICAgICAgLy9iaXRzdGFtcFJpcHBsZXNcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBSaXBwbGVzXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gUmlwcGxlc1wiLFxuICAgICAgICAgICAgXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICAvL2NyZWF0ZSBiaXRmaW5leCBwb3J0Zm9saW8gaXRlbXNcbiAgICAgICAgLy9iaXRmaW5leElPVEFcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gSU9UQVwiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcblxuICAgICAgICAvL2JpdGZpbmV4QlRDXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gQml0Y29pbnNcIixcbiAgICAgICAgICAgIFwiYml0ZmluZXhcIik7XG5cbiAgICAgICAgLy9iaXRmaW5leERhc2hcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhEYXNoXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gRGFzaFwiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcbiAgICB9Ki9cblxuXG4gICAgLyppbml0aWFsaXplUHJpY2VzKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJsdGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiLCBcIkxUQy9FVVJcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIsIFwiQlRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwieHJwXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIiwgXCJYUlAvRVVSXCIpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIsIFwiSU9UQS9CVENcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcImV1clwiLCBcImJpdGZpbmV4XCIsIFwiQlRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZXRoXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIiwgXCJFVEgvVVNEXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJpb3RcIiwgXCJldGhcIiwgXCJiaXRmaW5leFwiLCBcIklPVEEvRVRIXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJidGNcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiLCBcIkJUQy9VU0RcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImRzaFwiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIsIFwiRFNIL1VTRFwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZHNoXCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIiwgXCJEU0gvQlRDXCIpO1xuXG4gICAgICAgIHRoaXMuc2F2ZVByaWNlSW5mb3JtYXRpb24oKTtcbiAgICB9Ki9cblxuXG4gICAgLypjcmVhdGVQcmljZUluZm9ybWF0aW9uKGZyb206IHN0cmluZywgdG86IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IEN1cnJlbmN5UHJpY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5jcmVhdGVDdXJyZW5jeVByaWNlKGZyb20sIHRvLCBkZXNjcmlwdGlvbiwgcGxhdGZvcm0pO1xuICAgIH0qL1xuXG4gICAgc2F2ZVByaWNlSW5mb3JtYXRpb24oKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUHJlc3NlZCgpIHtcbiAgICAgICAgc3dpdGNoKHRoaXMudGFiU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgY2FzZSAyOiBcbiAgICAgICAgICAgICAgICAvL3BvcnRmb2xpbyBpdGVtIHNob3VsZCBiZSBjcmVhdGVkXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWF0ZVBvcnRmb2xpb0l0ZW1cIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiBcbiAgICAgICAgICAgICAgICAvL2N1cnJlbmN5IHByaWNlIHNob3VsZCBiZSBjcmVhdGVkICAgXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWF0ZUN1cnJlbmN5UHJpY2VcIl0pOyBcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy9jYWxjdWxhdGlvbnNcbiAgICBjYWxjdWxhdGVBbGwoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlSU9UQUV1cm9WaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVEYXNoRXVyb1ZpYUJUQygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZURhc2hVU0QoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVCVENJT1RBKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQlRDRXVybygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUJUQ1VTRCgpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUlPVEFVU0RWaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVJT1RBVVNEVmlhRVRIKCk7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBbGxFdXJvVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsVVNEVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsVVNEVmlhRXRoZXJldW0oKTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbEJpdHN0YW1wKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQUV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4SU9UQVwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0lPVEFFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlRGFzaEV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4RGFzaFwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImRzaFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0Rhc2hFdXJvVmlhQlRDID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlRGFzaFVTRCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leERhc2hcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJkc2hcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjRGFzaFVTRCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ0V1cm8oKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhCVENcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJldXJcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQlRDRXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ1VTRCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leEJUQ1wiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNCVENVU0QgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVJT1RBVVNEVmlhRVRIKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leElPVEFcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJpb3RcIiwgXCJldGhcIiwgXCJiaXRmaW5leFwiKSkgKiB0aGlzLmdldENvdXJzZShcImV0aFwiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNJT1RBVVNEVmlhRVRIID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQVVTRFZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICh0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIikpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjSU9UQVVTRFZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbEV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ0V1cm8pICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBRXVybykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hFdXJvVmlhQlRDKTtcbiAgICAgICAgdGhpcy5DYWxjQWxsRXVyb1ZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbFVTRFZpYUV0aGVyZXVtKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBVVNEVmlhRVRIKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjQlRDVVNEKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjRGFzaFVTRCk7XG4gICAgICAgIHRoaXMuQ2FsY0FsbFVTRFZpYUVUSCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbFVTRFZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjSU9UQVVTRFZpYUJUQykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ1VTRCkgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hVU0QpO1xuICAgICAgICB0aGlzLkNhbGNBbGxVU0RWaWFCVEMgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVCVENJT1RBKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAvIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JUQ0lPVEEgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cblxuICAgIGNhbGN1bGF0ZUFsbEJpdHN0YW1wKCkge1xuICAgICAgICBsZXQgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBFdXJvXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJsdGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBMVENBbW91bnRFVVIgPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEV1cm9cIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAvIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQlRDQW1vdW50RXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJ4cnBcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBYUlBBbW91bnRFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBMaXRlY29pbnNcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwibHRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wTFRDRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBCVENcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQlRDRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBSaXBwbGVzXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgcmVzdWx0ID0gcXVhbnRpdHkgKiB0aGlzLmdldENvdXJzZShcInhycFwiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcFhSUEVVUiA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjQml0c3RhbXBCVENFVVIpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNCaXRzdGFtcExUQ0VVUikgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JpdHN0YW1wWFJQRVVSKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBBbGxFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxufSJdfQ==