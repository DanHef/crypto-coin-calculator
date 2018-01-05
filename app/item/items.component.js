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
        this.calculationService.calculateAllResults();
        this.calcResultsPortfolios = this.calculationService.getAllCalculationResults();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdFO0FBQ2hFLDJFQUE0RDtBQUk1RCwrQ0FBNkM7QUFDN0MsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUN6RSxzRUFBb0U7QUFFcEUsMENBQTRDO0FBQzVDLDZCQUErQjtBQUMvQiwwREFBNEQ7QUFFNUQsMENBQXlEO0FBQ3pELHNEQUF3RDtBQVV4RDtJQXdCSSx3QkFBNkIsV0FBd0IsRUFDeEIsb0JBQTBDLEVBQzFDLE1BQWMsRUFDZCxvQkFBMEMsRUFDMUMsa0JBQXNDLEVBQ3RDLFNBQW9CO1FBTHBCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBNUJ6QyxrQkFBYSxHQUE2QixFQUFFLENBQUM7UUFFN0MsMkJBQXNCLEdBQW9CLEVBQUUsQ0FBQztRQUM3QywyQkFBc0IsR0FBb0IsRUFBRSxDQUFDO1FBRXJELHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUV0QixzQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDdkIsMEJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBRTNCLGtCQUFhLEdBQUcsSUFBSSwyQ0FBYSxFQUFFLENBQUM7UUFFcEMscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLHdCQUFtQixHQUFZLEtBQUssQ0FBQztRQUU3Qyw4QkFBOEI7UUFDOUIsMkRBQTJEO1FBQzNELGlFQUFpRTtRQUN6RCxnQkFBVyxHQUFXLHdDQUF3QyxDQUFDO1FBQy9ELHNCQUFpQixHQUFXLHdDQUF3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QUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFTSwyQ0FBa0IsR0FBekI7UUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2IsS0FBSyxDQUFDLGtCQUFrQixDQUFDO2dCQUNyQixPQUFPLEVBQUUsSUFBSTtnQkFDYixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO2dCQUN6QyxvREFBb0Q7Z0JBQ3BELGdCQUFnQixFQUFFLENBQUMsc0NBQXNDLEVBQUUsa0NBQWtDLENBQUM7YUFDakcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDakQsQ0FBQyxFQUFFLFVBQVUsS0FBSztnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBdlBRLGNBQWM7UUFMMUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsd0JBQXdCO1NBQ3hDLENBQUM7eUNBeUI0QywwQkFBVztZQUNGLDZDQUFvQjtZQUNsQyxlQUFNO1lBQ1EsNkNBQW9CO1lBQ3RCLHdDQUFrQjtZQUMzQixrQkFBUztPQTdCeEMsY0FBYyxDQXdQMUI7SUFBRCxxQkFBQztDQUFBLEFBeFBELElBd1BDO0FBeFBZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEFmdGVyVmlld0luaXR9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlIH0gZnJvbSAnLi9DdXJyZW5jeVByaWNlJztcbmltcG9ydCB7IENvaW5Qb3J0Zm9saW9JdGVtIH0gZnJvbSAnLi9Db2luUG9ydGZvbGlvSXRlbSc7XG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgUG9ydGZvbGlvSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9wb3J0Zm9saW8taXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2N1cnJlbmN5LXByaWNlLnNlcnZpY2VcIjtcbmltcG9ydCB7IENhbGN1bGF0aW9uU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2NhbGN1bGF0aW9uLnNlcnZpY2VcIjtcblxuaW1wb3J0ICogYXMgQWRtb2IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1hZG1vYlwiO1xuaW1wb3J0ICogYXMgdGltZXIgZnJvbSBcInRpbWVyXCI7XG5pbXBvcnQgKiBhcyBwbGF0Zm9ybU1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuXG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUGFnZVJvdXRlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgQnJvd3NlclBsYXRmb3JtTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9zcmMvYnJvd3Nlci9sb2NhdGlvbi9icm93c2VyX3BsYXRmb3JtX2xvY2F0aW9uXCI7XG5pbXBvcnQgeyBDYWxjdWxhdGlvblJlc3VsdCB9IGZyb20gXCIuL0NhbGN1bGF0aW9uUmVzdWx0XCI7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vaXRlbXMuY29tcG9uZW50Lmh0bWxcIixcbn0pXG5leHBvcnQgY2xhc3MgSXRlbXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICAgIHByaXZhdGUgY29pblBvcnRmb2xpbzogQXJyYXk8Q29pblBvcnRmb2xpb0l0ZW0+ID0gW107XG5cbiAgICBwcml2YXRlIGN1cnJlbmN5UHJpY2VzQml0c3RhbXA6IEN1cnJlbmN5UHJpY2VbXSA9IFtdO1xuICAgIHByaXZhdGUgY3VycmVuY3lQcmljZXNCaXRmaW5leDogQ3VycmVuY3lQcmljZVtdID0gW107XG5cbiAgICBjYWxjUmVzdWx0T3ZlcmFsbDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgY2FsY1Jlc3VsdEdlbmVyYWwgPSBbXTtcbiAgICBwcml2YXRlIGNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IFtdO1xuXG4gICAgcHJpdmF0ZSBzZWN1cmVTdG9yYWdlID0gbmV3IFNlY3VyZVN0b3JhZ2UoKTtcblxuICAgIHByaXZhdGUgdGFiU2VsZWN0ZWRJbmRleDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHRhYkJhck1hcmdpbjogbnVtYmVyID0gNTA7XG4gICAgcHJpdmF0ZSBjcmVhdGVCdXR0b25WaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvL0FkTW9iIGZvciBBbmRyb2lkIHRvIGJlIGRvbmVcbiAgICAvL3ByaXZhdGUgYW5kcm9pZEJhbm5lcklkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItWFhYWC9ZWVlZXCI7XG4gICAgLy9wcml2YXRlIGFuZHJvaWRJbnRlcnN0aXRpYWxJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLUtLS0svTExMTFwiO1xuICAgIHByaXZhdGUgaW9zQmFubmVySWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi0zNzA0NDM5MDg1MDMyMDgyLzM4NjM5MDMyNTJcIjtcbiAgICBwcml2YXRlIGlvc0ludGVyc3RpdGlhbElkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItMzcwNDQzOTA4NTAzMjA4Mi82MjEyNDc5Mzk0XCI7XG5cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaXRlbVNlcnZpY2U6IEl0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjdXJyZW5jeVByaWNlU2VydmljZTogQ3VycmVuY3lQcmljZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjYWxjdWxhdGlvblNlcnZpY2U6IENhbGN1bGF0aW9uU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHBhZ2VSb3V0ZTogUGFnZVJvdXRlKSB7XG4gICAgfVxuICAgIFxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICAvL2luaXRpYWxpemUgYnVmZmVyc1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmxvYWRQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5sb2FkQ3VycmVuY3lQcmljZXMoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UubG9hZEN1cnJlbmN5UHJpY2VzKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBvcnRmb2xpbygpO1xuICAgICAgICAgICAgLy90aGlzIG1ldGhvZCBvbmx5IHJlZnJlc2hlcyB0aGUgY3VycmVuY3kgcHJpY2UgZGF0YSBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlID0+IHRvIGhhdmUgdGhlIGFjdHVhbCBwcmljZXMgcmVmcmVzaCBvbiB0aGUgZGF0YSBoYXMgdG8gYmUgcGVyZm9ybWVkXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKTtcbiAgICBcbiAgICAgICAgICAgIC8vcmVhZCBkYXRhIGZyb20gdGhlIHJlc3BlY3RpdmUgcGxhdGZvcm1zXG4gICAgICAgICAgICBsZXQgcHJvbWlzZUJpdGZpbmV4ID0gdGhpcy5yZWZyZXNoQml0ZmluZXhEYXRhKCk7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5yZWZyZXNoQml0c3RhbXBEYXRhKCk7XG4gICAgXG4gICAgICAgICAgICBQcm9taXNlLmFsbChbcHJvbWlzZUJpdGZpbmV4LCBwcm9taXNlQml0c3RhbXBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlc3VsdHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmN1cnJlbmN5UHJpY2VzQ2hhbmdlZC5zdWJzY3JpYmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIC8vdGhpcy5jcmVhdGVJbnRlcnN0aXRpYWwoKTtcbiAgICAgICAgLy90aGlzLmNyZWF0ZUJhbm5lcigpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZGF0YSByZWZyZXNoIGxvZ2ljXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBvblJlZnJlc2hUcmlnZ2VyZWQoZXZlbnQpIHtcbiAgICAgICAgdmFyIHB1bGxUb1JlZnJlc2ggPSBldmVudC5vYmplY3Q7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoQWxsKHB1bGxUb1JlZnJlc2gpO1xuICAgIH1cblxuICAgIHJlZnJlc2hBbGwocHVsbFRvUmVmcmVzaCkge1xuICAgICAgICB0aGlzLnJlZnJlc2hQb3J0Zm9saW8oKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoTWFpbnRhaW5lZEN1cnJlbmN5UHJpY2VzKCk7XG5cbiAgICAgICAgbGV0IHByb21pc2VCaXRmaW5leCA9IHRoaXMucmVmcmVzaEJpdGZpbmV4RGF0YSgpO1xuICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5yZWZyZXNoQml0c3RhbXBEYXRhKCk7XG4gICAgICAgIFxuXG4gICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVSZXN1bHRzKCk7XG4gICAgICAgICAgICBwdWxsVG9SZWZyZXNoLnJlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdHN0YW1wRGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0c3RhbXBXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdGZpbmV4RGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRmaW5leFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0ZmluZXhXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICByZWZyZXNoUG9ydGZvbGlvKCkge1xuICAgICAgICB0aGlzLmNvaW5Qb3J0Zm9saW8gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldEFsbFBvcnRmb2xpb0l0ZW1zKCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0JpdGZpbmV4ID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQml0c3RhbXAgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0c3RhbXBcIik7XG4gICAgfVxuXG4gICAgcmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKSB7XG4gICAgICAgIHRoaXMuY2FsY1Jlc3VsdHNQb3J0Zm9saW9zID0gdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuZ2V0QWxsQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVzdWx0cygpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuY2FsY3VsYXRlQWxsUmVzdWx0cygpO1xuICAgICAgICB0aGlzLmNhbGNSZXN1bHRzUG9ydGZvbGlvcyA9IHRoaXMuY2FsY3VsYXRpb25TZXJ2aWNlLmdldEFsbENhbGN1bGF0aW9uUmVzdWx0cygpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL0VORDogZGF0YSByZWZyZXNoIGxvZ2ljXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgIGdldENvaW5Qb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lOiBzdHJpbmcsIHBvcnRmb2xpbzogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5nZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW8pO1xuICAgIH1cblxuXG4gICAgY3JlYXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb246IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcsIHN5bWJvbDogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5jcmVhdGVQb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24sIDAsIHBvcnRmb2xpbywgc3ltYm9sKTtcbiAgICB9XG5cbiAgICBvblBvcnRmb2xpb0l0ZW1RdWFudGl0eUNoYW5nZShxdWFudGl0eSwgcG9ydGZvbGlvSXRlbSkge1xuICAgICAgICBsZXQgY2hhbmdlZFBvcnRmb2xpb0l0ZW0gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUocG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSxwb3J0Zm9saW9JdGVtLnBvcnRmb2xpb05hbWUpO1xuICAgICAgICBjaGFuZ2VkUG9ydGZvbGlvSXRlbS5zZXRRdWFudGl0eShxdWFudGl0eSk7XG5cbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuICAgXG5cbiAgICBzYXZlUHJpY2VJbmZvcm1hdGlvbigpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVQcmVzc2VkKCkge1xuICAgICAgICBzd2l0Y2godGhpcy50YWJTZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgLy9jYWxjdWxhdGlvbiBmaWVsZCBzaG91bGQgYmUgY3JlYXRlZFxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jcmVhdGVDYWxjdWxhdGlvblJlc3VsdFwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIC8vcG9ydGZvbGlvIGl0ZW0gc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlUG9ydGZvbGlvSXRlbVwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIC8vY3VycmVuY3kgcHJpY2Ugc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlQ3VycmVuY3lQcmljZVwiXSk7IFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY1Jlc3VsdERlbGV0ZShjYWxjdWxhdGlvblJlc3VsdDogQ2FsY3VsYXRpb25SZXN1bHQpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuZGVsZXRlQ2FsY3VsYXRpb25SZXN1bHQoY2FsY3VsYXRpb25SZXN1bHQpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5zYXZlQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgfVxuXG5cbiAgICBwb3J0Zm9saW9JdGVtRGVsZXRlKHBvcnRmb2xpb0l0ZW06IENvaW5Qb3J0Zm9saW9JdGVtKSB7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZGVsZXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtKTtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG4gICAgfVxuXG4gICAgY3VycmVuY3lQcmljZURlbGV0ZShjdXJyZW5jeVByaWNlOiBDdXJyZW5jeVByaWNlKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZGVsZXRlQ3VycmVuY3lQcmljZShjdXJyZW5jeVByaWNlKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cblxuICAgIG9uVGFiSW5kZXhDaGFuZ2VkKGV2ZW50KSB7XG4gICAgICAgIGlmKHRoaXMudGFiU2VsZWN0ZWRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVCdXR0b25WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvblZpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFkTW9iIGZ1bmN0aW9uc1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHVibGljIGNyZWF0ZUJhbm5lcigpIHtcbiAgICAgICAgLy9kaWZmZXJlbnQgbWFyZ2luIGZvciBpUGhvbmUgWCBiZWNhdXNlIG9mIHRoZSBiaWdnZXIgc2NyZWVuXG4gICAgICAgIGlmIChwbGF0Zm9ybU1vZHVsZS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMgPT09IDI0MzYgJiZcbiAgICAgICAgICAgIHBsYXRmb3JtTW9kdWxlLmRldmljZS5kZXZpY2VUeXBlID09PSBcIlBob25lXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyTWFyZ2luID0gNTA7XG4gICAgICAgIH1cbiAgICAgICAgdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBZG1vYi5jcmVhdGVCYW5uZXIoe1xuICAgICAgICAgICAgICAgIHRlc3Rpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vdGVzdGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaXplOiBBZG1vYi5BRF9TSVpFLlNNQVJUX0JBTk5FUixcbiAgICAgICAgICAgICAgICBpb3NCYW5uZXJJZDogdGhpcy5pb3NCYW5uZXJJZCxcbiAgICAgICAgICAgICAgICAvL2FuZHJvaWRCYW5uZXJJZDogdGhpcy5hbmRyb2lkQmFubmVySWQsXG4gICAgICAgICAgICAgICAgaW9zVGVzdERldmljZUlkczogW1wiOUZFM0M0RTgtQzdEQi00MEVCLUJDQ0QtODRBNDMwNTBFRUFCXCIsIFwiZGVlODgxYjc4YzY3YzY0MjBhYzNjYjQxYWRkNDZhOTRcIl0sXG4gICAgICAgICAgICAgICAgbWFyZ2luczoge1xuICAgICAgICAgICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUJhbm5lciBkb25lXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVCYW5uZXIgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZUludGVyc3RpdGlhbCgpIHtcbiAgICAgICAgdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBZG1vYi5jcmVhdGVJbnRlcnN0aXRpYWwoe1xuICAgICAgICAgICAgICAgIHRlc3Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgaW9zSW50ZXJzdGl0aWFsSWQ6IHRoaXMuaW9zSW50ZXJzdGl0aWFsSWQsXG4gICAgICAgICAgICAgICAgLy9hbmRyb2lkSW50ZXJzdGl0aWFsSWQ6IHRoaXMuYW5kcm9pZEludGVyc3RpdGlhbElkLFxuICAgICAgICAgICAgICAgIGlvc1Rlc3REZXZpY2VJZHM6IFtcIjlGRTNDNEU4LUM3REItNDBFQi1CQ0NELTg0QTQzMDUwRUVBQlwiLCBcImRlZTg4MWI3OGM2N2M2NDIwYWMzY2I0MWFkZDQ2YTk0XCJdXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUludGVyc3RpdGlhbCBkb25lXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVJbnRlcnN0aXRpYWwgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxufSJdfQ==