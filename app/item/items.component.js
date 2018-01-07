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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdFO0FBQ2hFLDJFQUE0RDtBQUk1RCwrQ0FBNkM7QUFDN0MsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUN6RSxzRUFBb0U7QUFFcEUsMENBQTRDO0FBQzVDLDZCQUErQjtBQUMvQiwwREFBNEQ7QUFFNUQsMENBQXlEO0FBQ3pELHNEQUF3RDtBQVV4RDtJQXdCSSx3QkFBNkIsV0FBd0IsRUFDeEIsb0JBQTBDLEVBQzFDLE1BQWMsRUFDZCxvQkFBMEMsRUFDMUMsa0JBQXNDLEVBQ3RDLFNBQW9CO1FBTHBCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBNUJ6QyxrQkFBYSxHQUE2QixFQUFFLENBQUM7UUFFN0MsMkJBQXNCLEdBQW9CLEVBQUUsQ0FBQztRQUM3QywyQkFBc0IsR0FBb0IsRUFBRSxDQUFDO1FBRXJELHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUV0QixzQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDdkIsMEJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBRTNCLGtCQUFhLEdBQUcsSUFBSSwyQ0FBYSxFQUFFLENBQUM7UUFFcEMscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLHdCQUFtQixHQUFZLEtBQUssQ0FBQztRQUU3Qyw4QkFBOEI7UUFDOUIsMkRBQTJEO1FBQzNELGlFQUFpRTtRQUN6RCxnQkFBVyxHQUFXLHdDQUF3QyxDQUFDO1FBQy9ELHNCQUFpQixHQUFXLHdDQUF3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Q0FBQztRQUNQLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVNLDJDQUFrQixHQUF6QjtRQUNJLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDYixLQUFLLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3JCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7Z0JBQ3pDLG9EQUFvRDtnQkFDcEQsZ0JBQWdCLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxrQ0FBa0MsQ0FBQzthQUNqRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUNqRCxDQUFDLEVBQUUsVUFBVSxLQUFLO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUF4UFEsY0FBYztRQUwxQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx3QkFBd0I7U0FDeEMsQ0FBQzt5Q0F5QjRDLDBCQUFXO1lBQ0YsNkNBQW9CO1lBQ2xDLGVBQU07WUFDUSw2Q0FBb0I7WUFDdEIsd0NBQWtCO1lBQzNCLGtCQUFTO09BN0J4QyxjQUFjLENBeVAxQjtJQUFELHFCQUFDO0NBQUEsQUF6UEQsSUF5UEM7QUF6UFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XG5cbmltcG9ydCB7IEN1cnJlbmN5UHJpY2UgfSBmcm9tICcuL0N1cnJlbmN5UHJpY2UnO1xuaW1wb3J0IHsgQ29pblBvcnRmb2xpb0l0ZW0gfSBmcm9tICcuL0NvaW5Qb3J0Zm9saW9JdGVtJztcbmltcG9ydCB7IEl0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQb3J0Zm9saW9JdGVtU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL3BvcnRmb2xpby1pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvY3VycmVuY3ktcHJpY2Uuc2VydmljZVwiO1xuaW1wb3J0IHsgQ2FsY3VsYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvY2FsY3VsYXRpb24uc2VydmljZVwiO1xuXG5pbXBvcnQgKiBhcyBBZG1vYiBmcm9tIFwibmF0aXZlc2NyaXB0LWFkbW9iXCI7XG5pbXBvcnQgKiBhcyB0aW1lciBmcm9tIFwidGltZXJcIjtcbmltcG9ydCAqIGFzIHBsYXRmb3JtTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtXCI7XG5cbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBQYWdlUm91dGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL2xvY2F0aW9uL2Jyb3dzZXJfcGxhdGZvcm1fbG9jYXRpb25cIjtcbmltcG9ydCB7IENhbGN1bGF0aW9uUmVzdWx0IH0gZnJvbSBcIi4vQ2FsY3VsYXRpb25SZXN1bHRcIjtcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1pdGVtc1wiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9pdGVtcy5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBJdGVtc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcHJpdmF0ZSBjb2luUG9ydGZvbGlvOiBBcnJheTxDb2luUG9ydGZvbGlvSXRlbT4gPSBbXTtcblxuICAgIHByaXZhdGUgY3VycmVuY3lQcmljZXNCaXRzdGFtcDogQ3VycmVuY3lQcmljZVtdID0gW107XG4gICAgcHJpdmF0ZSBjdXJyZW5jeVByaWNlc0JpdGZpbmV4OiBDdXJyZW5jeVByaWNlW10gPSBbXTtcblxuICAgIGNhbGNSZXN1bHRPdmVyYWxsOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBjYWxjUmVzdWx0R2VuZXJhbCA9IFtdO1xuICAgIHByaXZhdGUgY2FsY1Jlc3VsdHNQb3J0Zm9saW9zID0gW107XG5cbiAgICBwcml2YXRlIHNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuXG4gICAgcHJpdmF0ZSB0YWJTZWxlY3RlZEluZGV4OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgdGFiQmFyTWFyZ2luOiBudW1iZXIgPSA1MDtcbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvblZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8vQWRNb2IgZm9yIEFuZHJvaWQgdG8gYmUgZG9uZVxuICAgIC8vcHJpdmF0ZSBhbmRyb2lkQmFubmVySWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi1YWFhYL1lZWVlcIjtcbiAgICAvL3ByaXZhdGUgYW5kcm9pZEludGVyc3RpdGlhbElkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItS0tLSy9MTExMXCI7XG4gICAgcHJpdmF0ZSBpb3NCYW5uZXJJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLTM3MDQ0MzkwODUwMzIwODIvMzg2MzkwMzI1MlwiO1xuICAgIHByaXZhdGUgaW9zSW50ZXJzdGl0aWFsSWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi0zNzA0NDM5MDg1MDMyMDgyLzYyMTI0NzkzOTRcIjtcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBwb3J0Zm9saW9JdGVtU2VydmljZTogUG9ydGZvbGlvSXRlbVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGN1cnJlbmN5UHJpY2VTZXJ2aWNlOiBDdXJyZW5jeVByaWNlU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNhbGN1bGF0aW9uU2VydmljZTogQ2FsY3VsYXRpb25TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcGFnZVJvdXRlOiBQYWdlUm91dGUpIHtcbiAgICB9XG4gICAgXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vaW5pdGlhbGl6ZSBidWZmZXJzXG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UubG9hZFBvcnRmb2xpbygpO1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmxvYWRDdXJyZW5jeVByaWNlcygpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5sb2FkQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoUG9ydGZvbGlvKCk7XG4gICAgICAgICAgICAvL3RoaXMgbWV0aG9kIG9ubHkgcmVmcmVzaGVzIHRoZSBjdXJyZW5jeSBwcmljZSBkYXRhIGZyb20gdGhlIGxvY2FsIHN0b3JhZ2UgPT4gdG8gaGF2ZSB0aGUgYWN0dWFsIHByaWNlcyByZWZyZXNoIG9uIHRoZSBkYXRhIGhhcyB0byBiZSBwZXJmb3JtZWRcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoTWFpbnRhaW5lZENhbGN1bGF0aW9uUmVzdWx0cygpO1xuICAgIFxuICAgICAgICAgICAgLy9yZWFkIGRhdGEgZnJvbSB0aGUgcmVzcGVjdGl2ZSBwbGF0Zm9ybXNcbiAgICAgICAgICAgIGxldCBwcm9taXNlQml0ZmluZXggPSB0aGlzLnJlZnJlc2hCaXRmaW5leERhdGEoKTtcbiAgICAgICAgICAgIGxldCBwcm9taXNlQml0c3RhbXAgPSB0aGlzLnJlZnJlc2hCaXRzdGFtcERhdGEoKTtcbiAgICBcbiAgICAgICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlUmVzdWx0cygpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDYWxjdWxhdGlvblJlc3VsdHMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuY3VycmVuY3lQcmljZXNDaGFuZ2VkLnN1YnNjcmliZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaE1haW50YWluZWRDdXJyZW5jeVByaWNlcygpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgLy90aGlzLmNyZWF0ZUludGVyc3RpdGlhbCgpO1xuICAgICAgICAvL3RoaXMuY3JlYXRlQmFubmVyKCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBkYXRhIHJlZnJlc2ggbG9naWNcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIG9uUmVmcmVzaFRyaWdnZXJlZChldmVudCkge1xuICAgICAgICB2YXIgcHVsbFRvUmVmcmVzaCA9IGV2ZW50Lm9iamVjdDtcblxuICAgICAgICB0aGlzLnJlZnJlc2hBbGwocHVsbFRvUmVmcmVzaCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEFsbChwdWxsVG9SZWZyZXNoKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFBvcnRmb2xpbygpO1xuICAgICAgICB0aGlzLnJlZnJlc2hNYWludGFpbmVkQ3VycmVuY3lQcmljZXMoKTtcblxuICAgICAgICBsZXQgcHJvbWlzZUJpdGZpbmV4ID0gdGhpcy5yZWZyZXNoQml0ZmluZXhEYXRhKCk7XG4gICAgICAgIGxldCBwcm9taXNlQml0c3RhbXAgPSB0aGlzLnJlZnJlc2hCaXRzdGFtcERhdGEoKTtcbiAgICAgICAgXG5cbiAgICAgICAgUHJvbWlzZS5hbGwoW3Byb21pc2VCaXRmaW5leCwgcHJvbWlzZUJpdHN0YW1wXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlc3VsdHMoKTtcbiAgICAgICAgICAgIHB1bGxUb1JlZnJlc2gucmVmcmVzaGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZWZyZXNoQml0c3RhbXBEYXRhKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2VzID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdHN0YW1wXCIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5pdGVtU2VydmljZS5sb2FkRGF0YUZyb21CaXRzdGFtcFdpdGhTeW1ib2woY3VycmVuY3lQcmljZXNbaV0pO1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZWZyZXNoQml0ZmluZXhEYXRhKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2VzID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRBbGxDdXJyZW5jeVByaWNlcyhcImJpdGZpbmV4XCIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5pdGVtU2VydmljZS5sb2FkRGF0YUZyb21CaXRmaW5leFdpdGhTeW1ib2woY3VycmVuY3lQcmljZXNbaV0pO1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHJlZnJlc2hQb3J0Zm9saW8oKSB7XG4gICAgICAgIHRoaXMuY29pblBvcnRmb2xpbyA9IHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZ2V0QWxsUG9ydGZvbGlvSXRlbXMoKTtcbiAgICB9XG5cbiAgICByZWZyZXNoTWFpbnRhaW5lZEN1cnJlbmN5UHJpY2VzKCkge1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQml0ZmluZXggPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEFsbEN1cnJlbmN5UHJpY2VzKFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNCaXRzdGFtcCA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0QWxsQ3VycmVuY3lQcmljZXMoXCJiaXRzdGFtcFwiKTtcbiAgICB9XG5cbiAgICByZWZyZXNoTWFpbnRhaW5lZENhbGN1bGF0aW9uUmVzdWx0cygpIHtcbiAgICAgICAgdGhpcy5jYWxjUmVzdWx0c1BvcnRmb2xpb3MgPSB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5nZXRBbGxDYWxjdWxhdGlvblJlc3VsdHMoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVSZXN1bHRzKCkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5jYWxjdWxhdGVBbGxSZXN1bHRzKCkudGhlbihmdW5jdGlvbihjYWxjdWxhdGlvblJlc3VsdHMpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY1Jlc3VsdHNQb3J0Zm9saW9zID0gY2FsY3VsYXRpb25SZXN1bHRzO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL0VORDogZGF0YSByZWZyZXNoIGxvZ2ljXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgIGdldENvaW5Qb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lOiBzdHJpbmcsIHBvcnRmb2xpbzogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5nZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW8pO1xuICAgIH1cblxuXG4gICAgY3JlYXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb246IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcsIHN5bWJvbDogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5jcmVhdGVQb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24sIDAsIHBvcnRmb2xpbywgc3ltYm9sKTtcbiAgICB9XG5cbiAgICBvblBvcnRmb2xpb0l0ZW1RdWFudGl0eUNoYW5nZShxdWFudGl0eSwgcG9ydGZvbGlvSXRlbSkge1xuICAgICAgICBsZXQgY2hhbmdlZFBvcnRmb2xpb0l0ZW0gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUocG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSxwb3J0Zm9saW9JdGVtLnBvcnRmb2xpb05hbWUpO1xuICAgICAgICBjaGFuZ2VkUG9ydGZvbGlvSXRlbS5zZXRRdWFudGl0eShxdWFudGl0eSk7XG5cbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgfVxuICAgXG5cbiAgICBzYXZlUHJpY2VJbmZvcm1hdGlvbigpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVQcmVzc2VkKCkge1xuICAgICAgICBzd2l0Y2godGhpcy50YWJTZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgLy9jYWxjdWxhdGlvbiBmaWVsZCBzaG91bGQgYmUgY3JlYXRlZFxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jcmVhdGVDYWxjdWxhdGlvblJlc3VsdFwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIC8vcG9ydGZvbGlvIGl0ZW0gc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlUG9ydGZvbGlvSXRlbVwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIC8vY3VycmVuY3kgcHJpY2Ugc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3JlYXRlQ3VycmVuY3lQcmljZVwiXSk7IFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY1Jlc3VsdERlbGV0ZShjYWxjdWxhdGlvblJlc3VsdDogQ2FsY3VsYXRpb25SZXN1bHQpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuZGVsZXRlQ2FsY3VsYXRpb25SZXN1bHQoY2FsY3VsYXRpb25SZXN1bHQpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5zYXZlQ2FsY3VsYXRpb25SZXN1bHRzKCk7XG4gICAgfVxuXG5cbiAgICBwb3J0Zm9saW9JdGVtRGVsZXRlKHBvcnRmb2xpb0l0ZW06IENvaW5Qb3J0Zm9saW9JdGVtKSB7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZGVsZXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtKTtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG4gICAgfVxuXG4gICAgY3VycmVuY3lQcmljZURlbGV0ZShjdXJyZW5jeVByaWNlOiBDdXJyZW5jeVByaWNlKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZGVsZXRlQ3VycmVuY3lQcmljZShjdXJyZW5jeVByaWNlKTtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICB9XG5cblxuICAgIG9uVGFiSW5kZXhDaGFuZ2VkKGV2ZW50KSB7XG4gICAgICAgIGlmKHRoaXMudGFiU2VsZWN0ZWRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVCdXR0b25WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvblZpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFkTW9iIGZ1bmN0aW9uc1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHVibGljIGNyZWF0ZUJhbm5lcigpIHtcbiAgICAgICAgLy9kaWZmZXJlbnQgbWFyZ2luIGZvciBpUGhvbmUgWCBiZWNhdXNlIG9mIHRoZSBiaWdnZXIgc2NyZWVuXG4gICAgICAgIGlmIChwbGF0Zm9ybU1vZHVsZS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMgPT09IDI0MzYgJiZcbiAgICAgICAgICAgIHBsYXRmb3JtTW9kdWxlLmRldmljZS5kZXZpY2VUeXBlID09PSBcIlBob25lXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyTWFyZ2luID0gNTA7XG4gICAgICAgIH1cbiAgICAgICAgdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBZG1vYi5jcmVhdGVCYW5uZXIoe1xuICAgICAgICAgICAgICAgIHRlc3Rpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vdGVzdGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaXplOiBBZG1vYi5BRF9TSVpFLlNNQVJUX0JBTk5FUixcbiAgICAgICAgICAgICAgICBpb3NCYW5uZXJJZDogdGhpcy5pb3NCYW5uZXJJZCxcbiAgICAgICAgICAgICAgICAvL2FuZHJvaWRCYW5uZXJJZDogdGhpcy5hbmRyb2lkQmFubmVySWQsXG4gICAgICAgICAgICAgICAgaW9zVGVzdERldmljZUlkczogW1wiOUZFM0M0RTgtQzdEQi00MEVCLUJDQ0QtODRBNDMwNTBFRUFCXCIsIFwiZGVlODgxYjc4YzY3YzY0MjBhYzNjYjQxYWRkNDZhOTRcIl0sXG4gICAgICAgICAgICAgICAgbWFyZ2luczoge1xuICAgICAgICAgICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUJhbm5lciBkb25lXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVCYW5uZXIgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZUludGVyc3RpdGlhbCgpIHtcbiAgICAgICAgdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBZG1vYi5jcmVhdGVJbnRlcnN0aXRpYWwoe1xuICAgICAgICAgICAgICAgIHRlc3Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgaW9zSW50ZXJzdGl0aWFsSWQ6IHRoaXMuaW9zSW50ZXJzdGl0aWFsSWQsXG4gICAgICAgICAgICAgICAgLy9hbmRyb2lkSW50ZXJzdGl0aWFsSWQ6IHRoaXMuYW5kcm9pZEludGVyc3RpdGlhbElkLFxuICAgICAgICAgICAgICAgIGlvc1Rlc3REZXZpY2VJZHM6IFtcIjlGRTNDNEU4LUM3REItNDBFQi1CQ0NELTg0QTQzMDUwRUVBQlwiLCBcImRlZTg4MWI3OGM2N2M2NDIwYWMzY2I0MWFkZDQ2YTk0XCJdXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUludGVyc3RpdGlhbCBkb25lXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVJbnRlcnN0aXRpYWwgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxufSJdfQ==