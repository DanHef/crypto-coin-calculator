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
var ItemsComponent = /** @class */ (function () {
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
        //initialize buffers
        this.portfolioItemService.loadPortfolio();
        this.currencyPriceService.loadCurrencyPrices().then(function () {
            var _this = this;
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
        }.bind(this));
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
        this.calculationService.calculateAllResults().then(function (calculationResults) {
            this.calcResultsPortfolios = calculationResults;
        }.bind(this));
    };
    //----------------------
    //END: data refresh logic
    //----------------------
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
    ItemsComponent.prototype.savePriceInformation = function () {
        this.currencyPriceService.saveCurrencyPrices();
    };
    ItemsComponent.prototype.createPressed = function () {
        switch (this.tabSelectedIndex) {
            case 2:
                //calculation field should be created
                this.router.navigate(["/createCalculationResult"]);
                break;
            case 0:
                //portfolio item should be created
                this.router.navigate(["/createPortfolioItem"]);
                break;
            case 1:
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
                iosTestDeviceIds: ["9FE3C4E8-C7DB-40EB-BCCD-84A43050EEAB", "dee881b78c67c6420ac3cb41add46a94", "6c11a0316df587310c7efff247137d4d46057644"],
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
                iosTestDeviceIds: ["9FE3C4E8-C7DB-40EB-BCCD-84A43050EEAB", "dee881b78c67c6420ac3cb41add46a94", "6c11a0316df587310c7efff247137d4d46057644"]
            }).then(function () {
                console.log("admob createInterstitial done");
            }, function (error) {
                console.log("admob createInterstitial error: " + error);
            });
        }.bind(this), 0);
    };
    ItemsComponent.prototype.sortPortfolio = function (item, otherItem) {
        this.portfolioItemService.savePortfolio();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdFO0FBQ2hFLDJFQUE0RDtBQUk1RCwrQ0FBNkM7QUFDN0MsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUN6RSxzRUFBb0U7QUFFcEUsMENBQTRDO0FBQzVDLDZCQUErQjtBQUMvQiwwREFBNEQ7QUFFNUQsMENBQXlEO0FBQ3pELHNEQUF3RDtBQVV4RDtJQXdCSSx3QkFBNkIsV0FBd0IsRUFDeEIsb0JBQTBDLEVBQzFDLE1BQWMsRUFDZCxvQkFBMEMsRUFDMUMsa0JBQXNDLEVBQ3RDLFNBQW9CO1FBTHBCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBNUJ6QyxrQkFBYSxHQUE2QixFQUFFLENBQUM7UUFFN0MsMkJBQXNCLEdBQW9CLEVBQUUsQ0FBQztRQUM3QywyQkFBc0IsR0FBb0IsRUFBRSxDQUFDO1FBRXJELHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUV0QixzQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDdkIsMEJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBRTNCLGtCQUFhLEdBQUcsSUFBSSwyQ0FBYSxFQUFFLENBQUM7UUFFcEMscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLHdCQUFtQixHQUFZLEtBQUssQ0FBQztRQUU3Qyw4QkFBOEI7UUFDOUIsMkRBQTJEO1FBQzNELGlFQUFpRTtRQUN6RCxnQkFBVyxHQUFXLHdDQUF3QyxDQUFDO1FBQy9ELHNCQUFpQixHQUFXLHdDQUF3QyxDQUFDO0lBUzdFLENBQUM7SUFFRCxpQ0FBUSxHQUFSO1FBQ0ksb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFBQSxpQkFnQm5EO1lBZkcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFN0MsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsZ0pBQWdKO1lBQ2hKLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDO1lBRTNDLHlDQUF5QztZQUN6QyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUNqRCxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUVqRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNqRCxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsS0FBSSxDQUFDLG1DQUFtQyxFQUFFLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDO1lBQ3RELElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsd0NBQWUsR0FBZjtRQUNJLDRCQUE0QjtRQUM1QixzQkFBc0I7SUFDMUIsQ0FBQztJQUVELDBCQUEwQjtJQUMxQixxQkFBcUI7SUFDckIsMEJBQTBCO0lBQzFCLDJDQUFrQixHQUFsQixVQUFtQixLQUFLO1FBQ3BCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFakMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsbUNBQVUsR0FBVixVQUFXLGFBQWE7UUFBeEIsaUJBWUM7UUFYRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsK0JBQStCLEVBQUUsQ0FBQztRQUV2QyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNqRCxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUdqRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pELEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLGFBQWEsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDRDQUFtQixHQUFuQjtRQUNJLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyw4QkFBOEIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFCO1FBRUQsT0FBTyxJQUFJLE9BQU8sQ0FBVSxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCw0Q0FBbUIsR0FBbkI7UUFDSSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWhGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsOEJBQThCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakYsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMxQjtRQUVELE9BQU8sSUFBSSxPQUFPLENBQVUsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QseUNBQWdCLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUMxRSxDQUFDO0lBRUQsd0RBQStCLEdBQS9CO1FBQ0ksSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFRCw0REFBbUMsR0FBbkM7UUFDSSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDcEYsQ0FBQztJQUVELHlDQUFnQixHQUFoQjtRQUNJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFTLGtCQUFrQjtZQUMxRSxJQUFJLENBQUMscUJBQXFCLEdBQUcsa0JBQWtCLENBQUM7UUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFDRCx3QkFBd0I7SUFDeEIseUJBQXlCO0lBQ3pCLHdCQUF3QjtJQUd4Qiw2Q0FBb0IsR0FBcEIsVUFBcUIsaUJBQXlCLEVBQUUsU0FBaUI7UUFDN0QsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsK0JBQStCLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUdELDRDQUFtQixHQUFuQixVQUFvQixpQkFBeUIsRUFBRSx3QkFBZ0MsRUFBRSxTQUFpQixFQUFFLE1BQWM7UUFDOUcsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1SCxDQUFDO0lBRUQsc0RBQTZCLEdBQTdCLFVBQThCLFFBQVEsRUFBRSxhQUFhO1FBQ2pELElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLCtCQUErQixDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEosb0JBQW9CLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBR0QsNkNBQW9CLEdBQXBCO1FBQ0ksSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVELHNDQUFhLEdBQWI7UUFDSSxRQUFPLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixLQUFLLENBQUM7Z0JBQ0YscUNBQXFDO2dCQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztnQkFDbkQsTUFBTTtZQUNWLEtBQUssQ0FBQztnQkFDRixrQ0FBa0M7Z0JBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNO1lBQ1YsS0FBSyxDQUFDO2dCQUNGLGtDQUFrQztnQkFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE1BQU07U0FDYjtJQUNMLENBQUM7SUFFRCx5Q0FBZ0IsR0FBaEIsVUFBaUIsaUJBQW9DO1FBQ2pELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ3JELENBQUM7SUFHRCw0Q0FBbUIsR0FBbkIsVUFBb0IsYUFBZ0M7UUFDaEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBRUQsNENBQW1CLEdBQW5CLFVBQW9CLGFBQTRCO1FBQzVDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBR0QsMENBQWlCLEdBQWpCLFVBQWtCLEtBQUs7UUFDbkIsSUFBRyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7U0FDcEM7YUFBTTtZQUNILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBR0QsdUJBQXVCO0lBQ3ZCLGtCQUFrQjtJQUNsQix1QkFBdUI7SUFDaEIscUNBQVksR0FBbkI7UUFDSSw0REFBNEQ7UUFDNUQsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEtBQUssSUFBSTtZQUN0RCxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxPQUFPLEVBQUU7WUFDOUMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7U0FDMUI7UUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2IsS0FBSyxDQUFDLFlBQVksQ0FBQztnQkFDZixPQUFPLEVBQUUsS0FBSztnQkFDZCxnQkFBZ0I7Z0JBQ2hCLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVk7Z0JBQ2hDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0Isd0NBQXdDO2dCQUN4QyxnQkFBZ0IsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLGtDQUFrQyxFQUFDLDBDQUEwQyxDQUFDO2dCQUN6SSxPQUFPLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLENBQUM7aUJBQ1o7YUFDSixDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUMzQyxDQUFDLEVBQUUsVUFBVSxLQUFLO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFTSwyQ0FBa0IsR0FBekI7UUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2IsS0FBSyxDQUFDLGtCQUFrQixDQUFDO2dCQUNyQixPQUFPLEVBQUUsSUFBSTtnQkFDYixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO2dCQUN6QyxvREFBb0Q7Z0JBQ3BELGdCQUFnQixFQUFFLENBQUMsc0NBQXNDLEVBQUUsa0NBQWtDLEVBQUUsMENBQTBDLENBQUM7YUFDN0ksQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDakQsQ0FBQyxFQUFFLFVBQVUsS0FBSztnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsc0NBQWEsR0FBYixVQUFjLElBQUksRUFBRSxTQUFTO1FBQ3pCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBNVBRLGNBQWM7UUFMMUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsd0JBQXdCO1NBQ3hDLENBQUM7eUNBeUI0QywwQkFBVztZQUNGLDZDQUFvQjtZQUNsQyxlQUFNO1lBQ1EsNkNBQW9CO1lBQ3RCLHdDQUFrQjtZQUMzQixrQkFBUztPQTdCeEMsY0FBYyxDQTZQMUI7SUFBRCxxQkFBQztDQUFBLEFBN1BELElBNlBDO0FBN1BZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEFmdGVyVmlld0luaXR9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlIH0gZnJvbSAnLi9DdXJyZW5jeVByaWNlJztcbmltcG9ydCB7IENvaW5Qb3J0Zm9saW9JdGVtIH0gZnJvbSAnLi9Db2luUG9ydGZvbGlvSXRlbSc7XG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgUG9ydGZvbGlvSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9wb3J0Zm9saW8taXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2N1cnJlbmN5LXByaWNlLnNlcnZpY2VcIjtcbmltcG9ydCB7IENhbGN1bGF0aW9uU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2NhbGN1bGF0aW9uLnNlcnZpY2VcIjtcblxuaW1wb3J0ICogYXMgQWRtb2IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1hZG1vYlwiO1xuaW1wb3J0ICogYXMgdGltZXIgZnJvbSBcInRpbWVyXCI7XG5pbXBvcnQgKiBhcyBwbGF0Zm9ybU1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuXG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUGFnZVJvdXRlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgQnJvd3NlclBsYXRmb3JtTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9zcmMvYnJvd3Nlci9sb2NhdGlvbi9icm93c2VyX3BsYXRmb3JtX2xvY2F0aW9uXCI7XG5pbXBvcnQgeyBDYWxjdWxhdGlvblJlc3VsdCB9IGZyb20gXCIuL0NhbGN1bGF0aW9uUmVzdWx0XCI7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vaXRlbXMuY29tcG9uZW50Lmh0bWxcIixcbn0pXG5leHBvcnQgY2xhc3MgSXRlbXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICAgIHByaXZhdGUgY29pblBvcnRmb2xpbzogQXJyYXk8Q29pblBvcnRmb2xpb0l0ZW0+ID0gW107XG5cbiAgICBwcml2YXRlIGN1cnJlbmN5UHJpY2VzQml0c3RhbXA6IEN1cnJlbmN5UHJpY2VbXSA9IFtdO1xuICAgIHByaXZhdGUgY3VycmVuY3lQcmljZXNCaXRmaW5leDogQ3VycmVuY3lQcmljZVtdID0gW107XG5cbiAgICBjYWxjUmVzdWx0T3ZlcmFsbDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgY2FsY1Jlc3VsdEdlbmVyYWwgPSBbXTtcbiAgICBwcml2YXRlIGNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IFtdO1xuXG4gICAgcHJpdmF0ZSBzZWN1cmVTdG9yYWdlID0gbmV3IFNlY3VyZVN0b3JhZ2UoKTtcblxuICAgIHByaXZhdGUgdGFiU2VsZWN0ZWRJbmRleDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHRhYkJhck1hcmdpbjogbnVtYmVyID0gNTA7XG4gICAgcHJpdmF0ZSBjcmVhdGVCdXR0b25WaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvL0FkTW9iIGZvciBBbmRyb2lkIHRvIGJlIGRvbmVcbiAgICAvL3ByaXZhdGUgYW5kcm9pZEJhbm5lcklkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItWFhYWC9ZWVlZXCI7XG4gICAgLy9wcml2YXRlIGFuZHJvaWRJbnRlcnN0aXRpYWxJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLUtLS0svTExMTFwiO1xuICAgIHByaXZhdGUgaW9zQmFubmVySWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi0zNzA0NDM5MDg1MDMyMDgyLzM4NjM5MDMyNTJcIjtcbiAgICBwcml2YXRlIGlvc0ludGVyc3RpdGlhbElkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItMzcwNDQzOTA4NTAzMjA4Mi82MjEyNDc5Mzk0XCI7XG5cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaXRlbVNlcnZpY2U6IEl0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjdXJyZW5jeVByaWNlU2VydmljZTogQ3VycmVuY3lQcmljZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjYWxjdWxhdGlvblNlcnZpY2U6IENhbGN1bGF0aW9uU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHBhZ2VSb3V0ZTogUGFnZVJvdXRlKSB7XG4gICAgfVxuICAgIFxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICAvL2luaXRpYWxpemUgYnVmZmVyc1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmxvYWRQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5sb2FkQ3VycmVuY3lQcmljZXMoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UubG9hZEN1cnJlbmN5UHJpY2VzKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBvcnRmb2xpbygpO1xuICAgICAgICAgICAgLy90aGlzIG1ldGhvZCBvbmx5IHJlZnJlc2hlcyB0aGUgY3VycmVuY3kgcHJpY2UgZGF0YSBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlID0+IHRvIGhhdmUgdGhlIGFjdHVhbCBwcmljZXMgcmVmcmVzaCBvbiB0aGUgZGF0YSBoYXMgdG8gYmUgcGVyZm9ybWVkXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKTtcbiAgICBcbiAgICAgICAgICAgIC8vcmVhZCBkYXRhIGZyb20gdGhlIHJlc3BlY3RpdmUgcGxhdGZvcm1zXG4gICAgICAgICAgICBsZXQgcHJvbWlzZUJpdGZpbmV4ID0gdGhpcy5yZWZyZXNoQml0ZmluZXhEYXRhKCk7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5yZWZyZXNoQml0c3RhbXBEYXRhKCk7XG4gICAgXG4gICAgICAgICAgICBQcm9taXNlLmFsbChbcHJvbWlzZUJpdGZpbmV4LCBwcm9taXNlQml0c3RhbXBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlc3VsdHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmN1cnJlbmN5UHJpY2VzQ2hhbmdlZC5zdWJzY3JpYmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIC8vdGhpcy5jcmVhdGVJbnRlcnN0aXRpYWwoKTtcbiAgICAgICAgLy90aGlzLmNyZWF0ZUJhbm5lcigpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZGF0YSByZWZyZXNoIGxvZ2ljXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBvblJlZnJlc2hUcmlnZ2VyZWQoZXZlbnQpIHtcbiAgICAgICAgdmFyIHB1bGxUb1JlZnJlc2ggPSBldmVudC5vYmplY3Q7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoQWxsKHB1bGxUb1JlZnJlc2gpO1xuICAgIH1cblxuICAgIHJlZnJlc2hBbGwocHVsbFRvUmVmcmVzaCkge1xuICAgICAgICB0aGlzLnJlZnJlc2hQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoTWFpbnRhaW5lZEN1cnJlbmN5UHJpY2VzKCk7XG5cbiAgICAgICAgbGV0IHByb21pc2VCaXRmaW5leCA9IHRoaXMucmVmcmVzaEJpdGZpbmV4RGF0YSgpO1xuICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5yZWZyZXNoQml0c3RhbXBEYXRhKCk7XG4gICAgICAgIFxuXG4gICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVSZXN1bHRzKCk7XG4gICAgICAgICAgICBwdWxsVG9SZWZyZXNoLnJlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdHN0YW1wRGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0c3RhbXBXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdGZpbmV4RGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRmaW5leFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0ZmluZXhXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICByZWZyZXNoUG9ydGZvbGlvKCkge1xuICAgICAgICB0aGlzLmNvaW5Qb3J0Zm9saW8gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldEFsbFBvcnRmb2xpb0l0ZW1zKCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0JpdGZpbmV4ID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQml0c3RhbXAgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0c3RhbXBcIik7XG4gICAgfVxuXG4gICAgcmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKSB7XG4gICAgICAgIHRoaXMuY2FsY1Jlc3VsdHNQb3J0Zm9saW9zID0gdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuZ2V0QWxsQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVzdWx0cygpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuY2FsY3VsYXRlQWxsUmVzdWx0cygpLnRoZW4oZnVuY3Rpb24oY2FsY3VsYXRpb25SZXN1bHRzKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IGNhbGN1bGF0aW9uUmVzdWx0cztcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9FTkQ6IGRhdGEgcmVmcmVzaCBsb2dpY1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICBnZXRDb2luUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCBwb3J0Zm9saW86IHN0cmluZyk6IENvaW5Qb3J0Zm9saW9JdGVtIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZ2V0UG9ydGZvbGlvSXRlbUJ5VGVjaG5pY2FsTmFtZShwb3J0Zm9saW9JdGVtTmFtZSwgcG9ydGZvbGlvKTtcbiAgICB9XG5cblxuICAgIGNyZWF0ZVBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZywgcG9ydGZvbGlvSXRlbURlc2NyaXB0aW9uOiBzdHJpbmcsIHBvcnRmb2xpbzogc3RyaW5nLCBzeW1ib2w6IHN0cmluZyk6IENvaW5Qb3J0Zm9saW9JdGVtIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuY3JlYXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtTmFtZSwgcG9ydGZvbGlvSXRlbURlc2NyaXB0aW9uLCAwLCBwb3J0Zm9saW8sIHN5bWJvbCk7XG4gICAgfVxuXG4gICAgb25Qb3J0Zm9saW9JdGVtUXVhbnRpdHlDaGFuZ2UocXVhbnRpdHksIHBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgbGV0IGNoYW5nZWRQb3J0Zm9saW9JdGVtID0gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5nZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbU5hbWUscG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9OYW1lKTtcbiAgICAgICAgY2hhbmdlZFBvcnRmb2xpb0l0ZW0uc2V0UXVhbnRpdHkocXVhbnRpdHkpO1xuXG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2Uuc2F2ZVBvcnRmb2xpbygpO1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLnNhdmVDdXJyZW5jeVByaWNlcygpO1xuICAgIH1cbiAgIFxuXG4gICAgc2F2ZVByaWNlSW5mb3JtYXRpb24oKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUHJlc3NlZCgpIHtcbiAgICAgICAgc3dpdGNoKHRoaXMudGFiU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIC8vY2FsY3VsYXRpb24gZmllbGQgc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlQ2FsY3VsYXRpb25SZXN1bHRcIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAwOiBcbiAgICAgICAgICAgICAgICAvL3BvcnRmb2xpbyBpdGVtIHNob3VsZCBiZSBjcmVhdGVkXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWF0ZVBvcnRmb2xpb0l0ZW1cIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOiBcbiAgICAgICAgICAgICAgICAvL2N1cnJlbmN5IHByaWNlIHNob3VsZCBiZSBjcmVhdGVkXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWF0ZUN1cnJlbmN5UHJpY2VcIl0pOyBcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbGNSZXN1bHREZWxldGUoY2FsY3VsYXRpb25SZXN1bHQ6IENhbGN1bGF0aW9uUmVzdWx0KSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRpb25TZXJ2aWNlLmRlbGV0ZUNhbGN1bGF0aW9uUmVzdWx0KGNhbGN1bGF0aW9uUmVzdWx0KTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2Uuc2F2ZUNhbGN1bGF0aW9uUmVzdWx0cygpO1xuICAgIH1cblxuXG4gICAgcG9ydGZvbGlvSXRlbURlbGV0ZShwb3J0Zm9saW9JdGVtOiBDb2luUG9ydGZvbGlvSXRlbSkge1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmRlbGV0ZVBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbSk7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2Uuc2F2ZVBvcnRmb2xpbygpO1xuICAgIH1cblxuICAgIGN1cnJlbmN5UHJpY2VEZWxldGUoY3VycmVuY3lQcmljZTogQ3VycmVuY3lQcmljZSkge1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmRlbGV0ZUN1cnJlbmN5UHJpY2UoY3VycmVuY3lQcmljZSk7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuXG5cbiAgICBvblRhYkluZGV4Q2hhbmdlZChldmVudCkge1xuICAgICAgICBpZih0aGlzLnRhYlNlbGVjdGVkSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQnV0dG9uVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVCdXR0b25WaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBZE1vYiBmdW5jdGlvbnNcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHB1YmxpYyBjcmVhdGVCYW5uZXIoKSB7XG4gICAgICAgIC8vZGlmZmVyZW50IG1hcmdpbiBmb3IgaVBob25lIFggYmVjYXVzZSBvZiB0aGUgYmlnZ2VyIHNjcmVlblxuICAgICAgICBpZiAocGxhdGZvcm1Nb2R1bGUuc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0UGl4ZWxzID09PSAyNDM2ICYmXG4gICAgICAgICAgICBwbGF0Zm9ybU1vZHVsZS5kZXZpY2UuZGV2aWNlVHlwZSA9PT0gXCJQaG9uZVwiKSB7XG4gICAgICAgICAgICB0aGlzLnRhYkJhck1hcmdpbiA9IDUwO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVyLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQWRtb2IuY3JlYXRlQmFubmVyKHtcbiAgICAgICAgICAgICAgICB0ZXN0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvL3Rlc3Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgc2l6ZTogQWRtb2IuQURfU0laRS5TTUFSVF9CQU5ORVIsXG4gICAgICAgICAgICAgICAgaW9zQmFubmVySWQ6IHRoaXMuaW9zQmFubmVySWQsXG4gICAgICAgICAgICAgICAgLy9hbmRyb2lkQmFubmVySWQ6IHRoaXMuYW5kcm9pZEJhbm5lcklkLFxuICAgICAgICAgICAgICAgIGlvc1Rlc3REZXZpY2VJZHM6IFtcIjlGRTNDNEU4LUM3REItNDBFQi1CQ0NELTg0QTQzMDUwRUVBQlwiLCBcImRlZTg4MWI3OGM2N2M2NDIwYWMzY2I0MWFkZDQ2YTk0XCIsXCI2YzExYTAzMTZkZjU4NzMxMGM3ZWZmZjI0NzEzN2Q0ZDQ2MDU3NjQ0XCJdLFxuICAgICAgICAgICAgICAgIG1hcmdpbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVCYW5uZXIgZG9uZVwiKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlQmFubmVyIGVycm9yOiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVJbnRlcnN0aXRpYWwoKSB7XG4gICAgICAgIHRpbWVyLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQWRtb2IuY3JlYXRlSW50ZXJzdGl0aWFsKHtcbiAgICAgICAgICAgICAgICB0ZXN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlvc0ludGVyc3RpdGlhbElkOiB0aGlzLmlvc0ludGVyc3RpdGlhbElkLFxuICAgICAgICAgICAgICAgIC8vYW5kcm9pZEludGVyc3RpdGlhbElkOiB0aGlzLmFuZHJvaWRJbnRlcnN0aXRpYWxJZCxcbiAgICAgICAgICAgICAgICBpb3NUZXN0RGV2aWNlSWRzOiBbXCI5RkUzQzRFOC1DN0RCLTQwRUItQkNDRC04NEE0MzA1MEVFQUJcIiwgXCJkZWU4ODFiNzhjNjdjNjQyMGFjM2NiNDFhZGQ0NmE5NFwiLCBcIjZjMTFhMDMxNmRmNTg3MzEwYzdlZmZmMjQ3MTM3ZDRkNDYwNTc2NDRcIl1cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRtb2IgY3JlYXRlSW50ZXJzdGl0aWFsIGRvbmVcIik7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUludGVyc3RpdGlhbCBlcnJvcjogXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICB9XG5cbiAgICBzb3J0UG9ydGZvbGlvKGl0ZW0sIG90aGVySXRlbSkge1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLnNhdmVQb3J0Zm9saW8oKTtcbiAgICB9XG59Il19