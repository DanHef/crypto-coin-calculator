"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var CurrencyPrice_1 = require("./CurrencyPrice");
var CoinPortfolioItem_1 = require("./CoinPortfolioItem");
var item_service_1 = require("./item.service");
var Admob = require("nativescript-admob");
var timer = require("timer");
var platformModule = require("tns-core-modules/platform");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var create_modal_component_1 = require("./create-modal/create-modal.component");
//import * as configSettings from "../config.json";
var ItemsComponent = (function () {
    function ItemsComponent(itemService, modalService, vcRef) {
        this.itemService = itemService;
        this.modalService = modalService;
        this.vcRef = vcRef;
        this.currencyPricesBitstamp = [];
        this.currencyPricesBitfinex = [];
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
        //this.initializePortfolio();
        //this.initializePrices();
        this.readSecureStorage();
        this.refreshBitfinexData();
        this.refreshBitstampData();
    };
    ItemsComponent.prototype.ngAfterViewInit = function () {
        //this.createInterstitial();
        //this.createBanner();
    };
    ItemsComponent.prototype.refreshAll = function (pullToRefresh) {
        var promiseBitfinex = this.refreshBitfinexData();
        var promiseBitstamp = this.refreshBitstampData();
        Promise.all([promiseBitfinex, promiseBitstamp]).then(function () {
            pullToRefresh.refreshing = false;
        });
    };
    ItemsComponent.prototype.refreshBitstampData = function () {
        var _this = this;
        var promises = [];
        for (var i = 0; i < this.currencyPricesBitstamp.length; i++) {
            var promise = this.itemService.loadDataFromBitstampWithSymbol(this.currencyPricesBitstamp[i]);
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
        for (var i = 0; i < this.currencyPricesBitfinex.length; i++) {
            var promise = this.itemService.loadDataFromBitfinexWithSymbol(this.currencyPricesBitfinex[i]);
            promises.push(promise);
        }
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function () {
                _this.calculateAll();
                resolve(true);
            });
        });
    };
    ItemsComponent.prototype.getCourse = function (from, to, platform) {
        if (platform === "bitfinex") {
            for (var i = 0; i < this.currencyPricesBitfinex.length; i++) {
                if (this.currencyPricesBitfinex[i].currencyCodeFrom === from &&
                    this.currencyPricesBitfinex[i].currencyCodeTo === to) {
                    return this.currencyPricesBitfinex[i].price;
                }
            }
        }
        else if (platform === "bitstamp") {
            for (var i = 0; i < this.currencyPricesBitstamp.length; i++) {
                if (this.currencyPricesBitstamp[i].currencyCodeFrom === from &&
                    this.currencyPricesBitstamp[i].currencyCodeTo === to) {
                    return this.currencyPricesBitstamp[i].price;
                }
            }
        }
    };
    ItemsComponent.prototype.getQuantity = function (portfolioItem) {
        if (portfolioItem) {
            return portfolioItem.getQuantity();
        }
    };
    ItemsComponent.prototype.getCoinPortfolioItem = function (portfolioItemName, portfolio) {
        for (var i = 0; i < this.coinPortfolio.length; i++) {
            if (this.coinPortfolio[i].getPortfolioName() === portfolio
                && this.coinPortfolio[i].getPortfolioItemName() === portfolioItemName) {
                return this.coinPortfolio[i];
            }
        }
        return null;
    };
    ItemsComponent.prototype.createPortfolioItem = function (portfolioItemName, portfolioItemDescription, portfolio) {
        var portfolioItem = new CoinPortfolioItem_1.CoinPortfolioItem();
        portfolioItem.setPortfolioName(portfolio);
        portfolioItem.setPortfolioItemName(portfolioItemName);
        portfolioItem.setPortfolioItemDescription(portfolioItemDescription);
        this.coinPortfolio.push(portfolioItem);
        return portfolioItem;
    };
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
    ItemsComponent.prototype.onRefreshPressed = function (event) {
        var pullToRefresh = event.object;
        this.refreshAll(pullToRefresh);
    };
    ItemsComponent.prototype.readSecureStorage = function () {
        var success = this.secureStorage.removeSync({
            key: "cryptoCoinCalcPortfolio"
        });
        var success = this.secureStorage.removeSync({
            key: "cryptoCoinCalcPriceInformationData"
        });
        //read portfolio items
        var storedPortfolioString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPortfolio",
        });
        if (storedPortfolioString) {
            var storedPortfolio = JSON.parse(storedPortfolioString);
            for (var i = 0; i < storedPortfolio.length; i++) {
                var storedPortfolioItem = storedPortfolio[i];
                var portfolioItem = this.getCoinPortfolioItem(storedPortfolioItem.portfolioItemName, storedPortfolioItem.portfolioName);
                if (portfolioItem) {
                    portfolioItem.setQuantity(storedPortfolioItem.quantity);
                }
                else {
                    console.log("PortfolioItem " + storedPortfolioItem.portfolioItemName + " not created");
                }
            }
        }
        //read price information data
        var storedPriceInformationString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPriceInformationData",
        });
        if (storedPriceInformationString) {
            var storedPriceInformations = JSON.parse(storedPriceInformationString);
            for (var i = 0; i < storedPriceInformations.length; i++) {
                var storedPriceInformation = storedPriceInformations[i];
                this.createPriceInformation(storedPriceInformation.currencyCodeFrom, storedPriceInformation.currencyCodeTo, storedPriceInformation.description, storedPriceInformation.platform);
            }
        }
        //read calculation bitstamp
        /*let storedCalculationFieldsString = this.secureStorage.getSync({
            key: "cryptoCoinCalcCalculationFields",
        });*/
        //read caluclation bitfinex
    };
    ItemsComponent.prototype.onPortfolioItemQuantityChange = function (quantity, portfolioItem) {
        portfolioItem.setQuantity(quantity);
        this.secureStorage.setSync({
            key: "cryptoCoinCalcPortfolio",
            value: JSON.stringify(this.coinPortfolio)
        });
    };
    ItemsComponent.prototype.initializePortfolio = function () {
        //create bitstamp portfolio items
        //bitstampLitecoins
        this.createPortfolioItem("bitstampLitecoins", "Bitstamp - Litecoins", "bitstamp");
        //bitstampEuro
        this.createPortfolioItem("bitstampEuro", "Bitstamp - Verfügbare Euro", "bitstamp");
        //bitstampBTC
        this.createPortfolioItem("bitstampBTC", "Bitstamp - Bitcoins", "bitstamp");
        //bitstampRipples
        this.createPortfolioItem("bitstampRipples", "Bitstamp - Ripples", "bitstamp");
        //create bitfinex portfolio items
        //bitfinexIOTA
        this.createPortfolioItem("bitfinexIOTA", "Bitfinex - IOTA", "bitfinex");
        //bitfinexBTC
        this.createPortfolioItem("bitfinexBTC", "Bitfinex - Bitcoins", "bitfinex");
        //bitfinexDash
        this.createPortfolioItem("bitfinexDash", "Bitfinex - Dash", "bitfinex");
    };
    ItemsComponent.prototype.initializePrices = function () {
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
    };
    ItemsComponent.prototype.addNewPriceInformation = function () {
    };
    ItemsComponent.prototype.createPriceInformation = function (from, to, description, platform) {
        var newCurrencyPrice = new CurrencyPrice_1.CurrencyPrice(from, to, platform, description);
        this.currencyPricesBitstamp.push(newCurrencyPrice);
        return newCurrencyPrice;
    };
    ItemsComponent.prototype.savePriceInformation = function () {
        var priceInformationDataStorage = this.currencyPricesBitstamp.concat(this.currencyPricesBitfinex);
        this.secureStorage.setSync({
            key: "cryptoCoinCalcPriceInformationData",
            value: JSON.stringify(priceInformationDataStorage)
        });
    };
    //create modal handling
    ItemsComponent.prototype.showCreatePopup = function () {
        var today = new Date();
        var options = {
            viewContainerRef: this.vcRef,
            context: today.toDateString(),
            fullscreen: false,
        };
        return this.modalService.showModal(create_modal_component_1.CreateModalViewComponent, options);
    };
    ItemsComponent.prototype.createPressed = function () {
        this.showCreatePopup();
    };
    __decorate([
        core_1.ViewChild('adView'),
        __metadata("design:type", Object)
    ], ItemsComponent.prototype, "adView", void 0);
    ItemsComponent = __decorate([
        core_1.Component({
            selector: "ns-items",
            moduleId: module.id,
            providers: [modal_dialog_1.ModalDialogService],
            templateUrl: "./items.component.html",
        }),
        __metadata("design:paramtypes", [item_service_1.ItemService, modal_dialog_1.ModalDialogService, core_1.ViewContainerRef])
    ], ItemsComponent);
    return ItemsComponent;
}());
exports.ItemsComponent = ItemsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQThGO0FBQzlGLDJFQUE0RDtBQUU1RCxpREFBZ0Q7QUFDaEQseURBQXdEO0FBQ3hELCtDQUE2QztBQUU3QywwQ0FBNEM7QUFDNUMsNkJBQStCO0FBQy9CLDBEQUE0RDtBQUU1RCxrRUFBMkY7QUFFM0YsZ0ZBQWlGO0FBRWpGLG1EQUFtRDtBQVNuRDtJQThFSSx3QkFBb0IsV0FBd0IsRUFBVSxZQUFnQyxFQUFVLEtBQXVCO1FBQW5HLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUEzRXZILDJCQUFzQixHQUFvQixFQUFFLENBQUM7UUFFN0MsMkJBQXNCLEdBQW9CLEVBQUUsQ0FBQztRQXNCN0Msa0JBQWEsR0FBNkIsRUFBRSxDQUFDO1FBRzdDLGtCQUFhLEdBQUcsSUFBSSwyQ0FBYSxFQUFFLENBQUM7UUFFcEMsMkRBQTJEO1FBQzNELGlFQUFpRTtRQUN6RCxnQkFBVyxHQUFXLHdDQUF3QyxDQUFDO1FBQy9ELHNCQUFpQixHQUFXLHdDQUF3QyxDQUFDO1FBQ3JFLGlCQUFZLEdBQVcsRUFBRSxDQUFDO0lBMEN5RixDQUFDO0lBeENySCxxQ0FBWSxHQUFuQjtRQUNJLDREQUE0RDtRQUM1RCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEtBQUssSUFBSTtZQUN0RCxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2IsS0FBSyxDQUFDLFlBQVksQ0FBQztnQkFDZixPQUFPLEVBQUUs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QUVELHNDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQXpjb0I7UUFBcEIsZ0JBQVMsQ0FBQyxRQUFRLENBQUM7O2tEQUFRO0lBRG5CLGNBQWM7UUFOMUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixTQUFTLEVBQUUsQ0FBQyxpQ0FBa0IsQ0FBQztZQUMvQixXQUFXLEVBQUUsd0JBQXdCO1NBQ3hDLENBQUM7eUNBK0VtQywwQkFBVyxFQUF3QixpQ0FBa0IsRUFBaUIsdUJBQWdCO09BOUU5RyxjQUFjLENBMmMxQjtJQUFELHFCQUFDO0NBQUEsQUEzY0QsSUEyY0M7QUEzY1ksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XG5cbmltcG9ydCB7IEN1cnJlbmN5UHJpY2UgfSBmcm9tICcuL0N1cnJlbmN5UHJpY2UnO1xuaW1wb3J0IHsgQ29pblBvcnRmb2xpb0l0ZW0gfSBmcm9tICcuL0NvaW5Qb3J0Zm9saW9JdGVtJztcbmltcG9ydCB7IEl0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS5zZXJ2aWNlXCI7XG5cbmltcG9ydCAqIGFzIEFkbW9iIGZyb20gXCJuYXRpdmVzY3JpcHQtYWRtb2JcIjtcbmltcG9ydCAqIGFzIHRpbWVyIGZyb20gXCJ0aW1lclwiO1xuaW1wb3J0ICogYXMgcGxhdGZvcm1Nb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm1cIjtcblxuaW1wb3J0IHsgTW9kYWxEaWFsb2dTZXJ2aWNlLCBNb2RhbERpYWxvZ09wdGlvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5cbmltcG9ydCB7IENyZWF0ZU1vZGFsVmlld0NvbXBvbmVudCB9IGZyb20gXCIuL2NyZWF0ZS1tb2RhbC9jcmVhdGUtbW9kYWwuY29tcG9uZW50XCI7XG5cbi8vaW1wb3J0ICogYXMgY29uZmlnU2V0dGluZ3MgZnJvbSBcIi4uL2NvbmZpZy5qc29uXCI7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHByb3ZpZGVyczogW01vZGFsRGlhbG9nU2VydmljZV0sXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9pdGVtcy5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBJdGVtc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgQFZpZXdDaGlsZCgnYWRWaWV3JykgYWRWaWV3O1xuXG4gICAgY3VycmVuY3lQcmljZXNCaXRzdGFtcDogQ3VycmVuY3lQcmljZVtdID0gW107XG5cbiAgICBjdXJyZW5jeVByaWNlc0JpdGZpbmV4OiBDdXJyZW5jeVByaWNlW10gPSBbXTtcblxuICAgIENhbGNJT1RBRXVybzogc3RyaW5nO1xuICAgIENhbGNJT1RBVVNEVmlhRVRIOiBzdHJpbmc7XG4gICAgQ2FsY0lPVEFVU0RWaWFCVEM6IHN0cmluZztcbiAgICBDYWxjRGFzaEV1cm9WaWFCVEM6IHN0cmluZztcbiAgICBDYWxjRGFzaFVTRDogc3RyaW5nO1xuICAgIENhbGNCVENFdXJvOiBzdHJpbmc7XG4gICAgQ2FsY0JUQ1VTRDogc3RyaW5nO1xuICAgIENhbGNCVENJT1RBOiBzdHJpbmc7XG4gICAgQ2FsY0FsbEV1cm9WaWFCVEM6IHN0cmluZztcbiAgICBDYWxjQWxsVVNEVmlhRVRIOiBzdHJpbmc7XG4gICAgQ2FsY0FsbFVTRFZpYUJUQzogc3RyaW5nO1xuXG4gICAgQ2FsY0JpdHN0YW1wTFRDQW1vdW50RVVSOiBzdHJpbmc7XG4gICAgQ2FsY0JpdHN0YW1wQlRDQW1vdW50RXVybzogc3RyaW5nO1xuICAgIENhbGNCaXRzdGFtcFhSUEFtb3VudEV1cm86IHN0cmluZztcbiAgICBDYWxjQml0c3RhbXBMVENFVVI6IHN0cmluZztcbiAgICBDYWxjQml0c3RhbXBCVENFVVI6IHN0cmluZztcbiAgICBDYWxjQml0c3RhbXBYUlBFVVI6IHN0cmluZztcbiAgICBDYWxjQml0c3RhbXBBbGxFdXJvOiBzdHJpbmc7XG5cbiAgICBjb2luUG9ydGZvbGlvOiBBcnJheTxDb2luUG9ydGZvbGlvSXRlbT4gPSBbXTtcblxuXG4gICAgc2VjdXJlU3RvcmFnZSA9IG5ldyBTZWN1cmVTdG9yYWdlKCk7XG5cbiAgICAvL3ByaXZhdGUgYW5kcm9pZEJhbm5lcklkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItWFhYWC9ZWVlZXCI7XG4gICAgLy9wcml2YXRlIGFuZHJvaWRJbnRlcnN0aXRpYWxJZDogc3RyaW5nID0gXCJjYS1hcHAtcHViLUtLS0svTExMTFwiO1xuICAgIHByaXZhdGUgaW9zQmFubmVySWQ6IHN0cmluZyA9IFwiY2EtYXBwLXB1Yi0zNzA0NDM5MDg1MDMyMDgyLzM4NjM5MDMyNTJcIjtcbiAgICBwcml2YXRlIGlvc0ludGVyc3RpdGlhbElkOiBzdHJpbmcgPSBcImNhLWFwcC1wdWItMzcwNDQzOTA4NTAzMjA4Mi82MjEyNDc5Mzk0XCI7XG4gICAgcHJpdmF0ZSB0YWJCYXJNYXJnaW46IG51bWJlciA9IDUwO1xuXG4gICAgcHVibGljIGNyZWF0ZUJhbm5lcigpIHtcbiAgICAgICAgLy9kaWZmZXJlbnQgbWFyZ2luIGZvciBpUGhvbmUgWCBiZWNhdXNlIG9mIHRoZSBiaWdnZXIgc2NyZWVuXG4gICAgICAgIGlmIChwbGF0Zm9ybU1vZHVsZS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMgPT09IDI0MzYgJiZcbiAgICAgICAgICAgIHBsYXRmb3JtTW9kdWxlLmRldmljZS5kZXZpY2VUeXBlID09PSBcIlBob25lXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyTWFyZ2luID0gNTA7XG4gICAgICAgIH1cbiAgICAgICAgdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBZG1vYi5jcmVhdGVCYW5uZXIoe1xuICAgICAgICAgICAgICAgIHRlc3Rpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vdGVzdGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaXplOiBBZG1vYi5BRF9TSVpFLlNNQVJUX0JBTk5FUixcbiAgICAgICAgICAgICAgICBpb3NCYW5uZXJJZDogdGhpcy5pb3NCYW5uZXJJZCxcbiAgICAgICAgICAgICAgICAvL2FuZHJvaWRCYW5uZXJJZDogdGhpcy5hbmRyb2lkQmFubmVySWQsXG4gICAgICAgICAgICAgICAgaW9zVGVzdERldmljZUlkczogW1wiOUZFM0M0RTgtQzdEQi00MEVCLUJDQ0QtODRBNDMwNTBFRUFCXCIsIFwiZGVlODgxYjc4YzY3YzY0MjBhYzNjYjQxYWRkNDZhOTRcIl0sXG4gICAgICAgICAgICAgICAgbWFyZ2luczoge1xuICAgICAgICAgICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUJhbm5lciBkb25lXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVCYW5uZXIgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZUludGVyc3RpdGlhbCgpIHtcbiAgICAgICAgdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBZG1vYi5jcmVhdGVJbnRlcnN0aXRpYWwoe1xuICAgICAgICAgICAgICAgIHRlc3Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgaW9zSW50ZXJzdGl0aWFsSWQ6IHRoaXMuaW9zSW50ZXJzdGl0aWFsSWQsXG4gICAgICAgICAgICAgICAgLy9hbmRyb2lkSW50ZXJzdGl0aWFsSWQ6IHRoaXMuYW5kcm9pZEludGVyc3RpdGlhbElkLFxuICAgICAgICAgICAgICAgIGlvc1Rlc3REZXZpY2VJZHM6IFtcIjlGRTNDNEU4LUM3REItNDBFQi1CQ0NELTg0QTQzMDUwRUVBQlwiLCBcImRlZTg4MWI3OGM2N2M2NDIwYWMzY2I0MWFkZDQ2YTk0XCJdXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkbW9iIGNyZWF0ZUludGVyc3RpdGlhbCBkb25lXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZG1vYiBjcmVhdGVJbnRlcnN0aXRpYWwgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UsIHByaXZhdGUgbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UsIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYpIHsgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vdGhpcy5pbml0aWFsaXplUG9ydGZvbGlvKCk7XG4gICAgICAgIC8vdGhpcy5pbml0aWFsaXplUHJpY2VzKCk7XG4gICAgICAgIHRoaXMucmVhZFNlY3VyZVN0b3JhZ2UoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoQml0ZmluZXhEYXRhKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaEJpdHN0YW1wRGF0YSgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgLy90aGlzLmNyZWF0ZUludGVyc3RpdGlhbCgpO1xuICAgICAgICAvL3RoaXMuY3JlYXRlQmFubmVyKCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEFsbChwdWxsVG9SZWZyZXNoKSB7XG4gICAgICAgIGxldCBwcm9taXNlQml0ZmluZXggPSB0aGlzLnJlZnJlc2hCaXRmaW5leERhdGEoKTtcbiAgICAgICAgbGV0IHByb21pc2VCaXRzdGFtcCA9IHRoaXMucmVmcmVzaEJpdHN0YW1wRGF0YSgpO1xuXG4gICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcHVsbFRvUmVmcmVzaC5yZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZnJlc2hCaXRzdGFtcERhdGEoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJyZW5jeVByaWNlc0JpdHN0YW1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0c3RhbXBXaXRoU3ltYm9sKHRoaXMuY3VycmVuY3lQcmljZXNCaXRzdGFtcFtpXSk7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbCgpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEJpdGZpbmV4RGF0YSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIHByb21pc2VzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbmN5UHJpY2VzQml0ZmluZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5pdGVtU2VydmljZS5sb2FkRGF0YUZyb21CaXRmaW5leFdpdGhTeW1ib2wodGhpcy5jdXJyZW5jeVByaWNlc0JpdGZpbmV4W2ldKTtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsKCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGdldENvdXJzZShmcm9tLCB0bywgcGxhdGZvcm0pOiBudW1iZXIge1xuICAgICAgICBpZiAocGxhdGZvcm0gPT09IFwiYml0ZmluZXhcIikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbmN5UHJpY2VzQml0ZmluZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW5jeVByaWNlc0JpdGZpbmV4W2ldLmN1cnJlbmN5Q29kZUZyb20gPT09IGZyb20gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0JpdGZpbmV4W2ldLmN1cnJlbmN5Q29kZVRvID09PSB0bykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlc0JpdGZpbmV4W2ldLnByaWNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gXCJiaXRzdGFtcFwiKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVuY3lQcmljZXNCaXRzdGFtcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbmN5UHJpY2VzQml0c3RhbXBbaV0uY3VycmVuY3lDb2RlRnJvbSA9PT0gZnJvbSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQml0c3RhbXBbaV0uY3VycmVuY3lDb2RlVG8gPT09IHRvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbmN5UHJpY2VzQml0c3RhbXBbaV0ucHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UXVhbnRpdHkocG9ydGZvbGlvSXRlbTogQ29pblBvcnRmb2xpb0l0ZW0pOiBudW1iZXIge1xuICAgICAgICBpZiAocG9ydGZvbGlvSXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHBvcnRmb2xpb0l0ZW0uZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0Q29pblBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcpOiBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb2luUG9ydGZvbGlvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb2luUG9ydGZvbGlvW2ldLmdldFBvcnRmb2xpb05hbWUoKSA9PT0gcG9ydGZvbGlvXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5jb2luUG9ydGZvbGlvW2ldLmdldFBvcnRmb2xpb0l0ZW1OYW1lKCkgPT09IHBvcnRmb2xpb0l0ZW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29pblBvcnRmb2xpb1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuXG4gICAgY3JlYXRlUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb246IHN0cmluZywgcG9ydGZvbGlvOiBzdHJpbmcpOiBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgICAgIGxldCBwb3J0Zm9saW9JdGVtID0gbmV3IENvaW5Qb3J0Zm9saW9JdGVtKCk7XG4gICAgICAgIHBvcnRmb2xpb0l0ZW0uc2V0UG9ydGZvbGlvTmFtZShwb3J0Zm9saW8pO1xuICAgICAgICBwb3J0Zm9saW9JdGVtLnNldFBvcnRmb2xpb0l0ZW1OYW1lKHBvcnRmb2xpb0l0ZW1OYW1lKTtcbiAgICAgICAgcG9ydGZvbGlvSXRlbS5zZXRQb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24ocG9ydGZvbGlvSXRlbURlc2NyaXB0aW9uKTtcblxuICAgICAgICB0aGlzLmNvaW5Qb3J0Zm9saW8ucHVzaChwb3J0Zm9saW9JdGVtKTtcblxuICAgICAgICByZXR1cm4gcG9ydGZvbGlvSXRlbTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVBbGwoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlSU9UQUV1cm9WaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVEYXNoRXVyb1ZpYUJUQygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZURhc2hVU0QoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVCVENJT1RBKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQlRDRXVybygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUJUQ1VTRCgpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUlPVEFVU0RWaWFCVEMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVJT1RBVVNEVmlhRVRIKCk7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBbGxFdXJvVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsVVNEVmlhQlRDKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQWxsVVNEVmlhRXRoZXJldW0oKTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUFsbEJpdHN0YW1wKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQUV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4SU9UQVwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImlvdFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0lPVEFFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlRGFzaEV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAodGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4RGFzaFwiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImRzaFwiLCBcImJ0Y1wiLCBcImJpdGZpbmV4XCIpKSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0Rhc2hFdXJvVmlhQlRDID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlRGFzaFVTRCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leERhc2hcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJkc2hcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjRGFzaFVTRCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ0V1cm8oKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhCVENcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJldXJcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQlRDRXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUJUQ1VTRCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leEJUQ1wiLCBcImJpdGZpbmV4XCIpLmdldFF1YW50aXR5KCkgKiB0aGlzLmdldENvdXJzZShcImJ0Y1wiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNCVENVU0QgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVJT1RBVVNEVmlhRVRIKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gKHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRmaW5leElPVEFcIiwgXCJiaXRmaW5leFwiKS5nZXRRdWFudGl0eSgpICogdGhpcy5nZXRDb3Vyc2UoXCJpb3RcIiwgXCJldGhcIiwgXCJiaXRmaW5leFwiKSkgKiB0aGlzLmdldENvdXJzZShcImV0aFwiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIpO1xuICAgICAgICB0aGlzLkNhbGNJT1RBVVNEVmlhRVRIID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSU9UQVVTRFZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICh0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAqIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIikpICogdGhpcy5nZXRDb3Vyc2UoXCJidGNcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiKTtcbiAgICAgICAgdGhpcy5DYWxjSU9UQVVTRFZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbEV1cm9WaWFCVEMoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ0V1cm8pICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBRXVybykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hFdXJvVmlhQlRDKTtcbiAgICAgICAgdGhpcy5DYWxjQWxsRXVyb1ZpYUJUQyA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbFVTRFZpYUV0aGVyZXVtKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gcGFyc2VGbG9hdCh0aGlzLkNhbGNJT1RBVVNEVmlhRVRIKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjQlRDVVNEKSArIHBhcnNlRmxvYXQodGhpcy5DYWxjRGFzaFVTRCk7XG4gICAgICAgIHRoaXMuQ2FsY0FsbFVTRFZpYUVUSCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUFsbFVTRFZpYUJUQygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjSU9UQVVTRFZpYUJUQykgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JUQ1VTRCkgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0Rhc2hVU0QpO1xuICAgICAgICB0aGlzLkNhbGNBbGxVU0RWaWFCVEMgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVCVENJT1RBKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsIFwiYml0ZmluZXhcIikuZ2V0UXVhbnRpdHkoKSAvIHRoaXMuZ2V0Q291cnNlKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JUQ0lPVEEgPSByZXN1bHQudG9TdHJpbmcoKTtcbiAgICB9XG5cblxuICAgIGNhbGN1bGF0ZUFsbEJpdHN0YW1wKCkge1xuICAgICAgICBsZXQgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBFdXJvXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJsdGNcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBMVENBbW91bnRFVVIgPSByZXN1bHQudG9TdHJpbmcoKTtcblxuICAgICAgICBxdWFudGl0eSA9IHRoaXMuZ2V0Q29pblBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEV1cm9cIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAvIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQlRDQW1vdW50RXVybyA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHF1YW50aXR5ID0gdGhpcy5nZXRDb2luUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLCBcImJpdHN0YW1wXCIpLmdldFF1YW50aXR5KCk7XG4gICAgICAgIHJlc3VsdCA9IHF1YW50aXR5IC8gdGhpcy5nZXRDb3Vyc2UoXCJ4cnBcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBYUlBBbW91bnRFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBMaXRlY29pbnNcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwibHRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wTFRDRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBCVENcIiwgXCJiaXRzdGFtcFwiKS5nZXRRdWFudGl0eSgpO1xuICAgICAgICByZXN1bHQgPSBxdWFudGl0eSAqIHRoaXMuZ2V0Q291cnNlKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIik7XG4gICAgICAgIHRoaXMuQ2FsY0JpdHN0YW1wQlRDRVVSID0gcmVzdWx0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgcXVhbnRpdHkgPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBSaXBwbGVzXCIsIFwiYml0c3RhbXBcIikuZ2V0UXVhbnRpdHkoKTtcbiAgICAgICAgcmVzdWx0ID0gcXVhbnRpdHkgKiB0aGlzLmdldENvdXJzZShcInhycFwiLCBcImV1clwiLCBcImJpdHN0YW1wXCIpO1xuICAgICAgICB0aGlzLkNhbGNCaXRzdGFtcFhSUEVVUiA9IHJlc3VsdC50b1N0cmluZygpO1xuXG4gICAgICAgIHJlc3VsdCA9IHBhcnNlRmxvYXQodGhpcy5DYWxjQml0c3RhbXBCVENFVVIpICsgcGFyc2VGbG9hdCh0aGlzLkNhbGNCaXRzdGFtcExUQ0VVUikgKyBwYXJzZUZsb2F0KHRoaXMuQ2FsY0JpdHN0YW1wWFJQRVVSKTtcbiAgICAgICAgdGhpcy5DYWxjQml0c3RhbXBBbGxFdXJvID0gcmVzdWx0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgb25SZWZyZXNoUHJlc3NlZChldmVudCkge1xuICAgICAgICB2YXIgcHVsbFRvUmVmcmVzaCA9IGV2ZW50Lm9iamVjdDtcblxuICAgICAgICB0aGlzLnJlZnJlc2hBbGwocHVsbFRvUmVmcmVzaCk7XG4gICAgfVxuXG5cblxuICAgIHJlYWRTZWN1cmVTdG9yYWdlKCkge1xuICAgICAgICB2YXIgc3VjY2VzcyA9IHRoaXMuc2VjdXJlU3RvcmFnZS5yZW1vdmVTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1BvcnRmb2xpb1wiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBzdWNjZXNzID0gdGhpcy5zZWN1cmVTdG9yYWdlLnJlbW92ZVN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUHJpY2VJbmZvcm1hdGlvbkRhdGFcIlxuICAgICAgICB9KTtcblxuICAgICAgICAvL3JlYWQgcG9ydGZvbGlvIGl0ZW1zXG4gICAgICAgIGxldCBzdG9yZWRQb3J0Zm9saW9TdHJpbmcgPSB0aGlzLnNlY3VyZVN0b3JhZ2UuZ2V0U3luYyh7XG4gICAgICAgICAgICBrZXk6IFwiY3J5cHRvQ29pbkNhbGNQb3J0Zm9saW9cIixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHN0b3JlZFBvcnRmb2xpb1N0cmluZykge1xuICAgICAgICAgICAgbGV0IHN0b3JlZFBvcnRmb2xpbyA9IEpTT04ucGFyc2Uoc3RvcmVkUG9ydGZvbGlvU3RyaW5nKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RvcmVkUG9ydGZvbGlvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlZFBvcnRmb2xpb0l0ZW0gPSBzdG9yZWRQb3J0Zm9saW9baV07XG4gICAgICAgICAgICAgICAgbGV0IHBvcnRmb2xpb0l0ZW0gPSB0aGlzLmdldENvaW5Qb3J0Zm9saW9JdGVtKHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocG9ydGZvbGlvSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBwb3J0Zm9saW9JdGVtLnNldFF1YW50aXR5KHN0b3JlZFBvcnRmb2xpb0l0ZW0ucXVhbnRpdHkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUG9ydGZvbGlvSXRlbSBcIiArIHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbU5hbWUgKyBcIiBub3QgY3JlYXRlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL3JlYWQgcHJpY2UgaW5mb3JtYXRpb24gZGF0YVxuICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvblN0cmluZyA9IHRoaXMuc2VjdXJlU3RvcmFnZS5nZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1ByaWNlSW5mb3JtYXRpb25EYXRhXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdG9yZWRQcmljZUluZm9ybWF0aW9uU3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbnMgPSBKU09OLnBhcnNlKHN0b3JlZFByaWNlSW5mb3JtYXRpb25TdHJpbmcpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlZFByaWNlSW5mb3JtYXRpb24gPSBzdG9yZWRQcmljZUluZm9ybWF0aW9uc1tpXTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihzdG9yZWRQcmljZUluZm9ybWF0aW9uLmN1cnJlbmN5Q29kZUZyb20sXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lDb2RlVG8sXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFByaWNlSW5mb3JtYXRpb24uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFByaWNlSW5mb3JtYXRpb24ucGxhdGZvcm0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL3JlYWQgY2FsY3VsYXRpb24gYml0c3RhbXBcbiAgICAgICAgLypsZXQgc3RvcmVkQ2FsY3VsYXRpb25GaWVsZHNTdHJpbmcgPSB0aGlzLnNlY3VyZVN0b3JhZ2UuZ2V0U3luYyh7XG4gICAgICAgICAgICBrZXk6IFwiY3J5cHRvQ29pbkNhbGNDYWxjdWxhdGlvbkZpZWxkc1wiLFxuICAgICAgICB9KTsqL1xuXG4gICAgICAgIC8vcmVhZCBjYWx1Y2xhdGlvbiBiaXRmaW5leFxuICAgIH1cblxuXG4gICAgb25Qb3J0Zm9saW9JdGVtUXVhbnRpdHlDaGFuZ2UocXVhbnRpdHksIHBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgcG9ydGZvbGlvSXRlbS5zZXRRdWFudGl0eShxdWFudGl0eSk7XG5cbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUG9ydGZvbGlvXCIsXG4gICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkodGhpcy5jb2luUG9ydGZvbGlvKVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGluaXRpYWxpemVQb3J0Zm9saW8oKSB7XG4gICAgICAgIC8vY3JlYXRlIGJpdHN0YW1wIHBvcnRmb2xpbyBpdGVtc1xuICAgICAgICAvL2JpdHN0YW1wTGl0ZWNvaW5zXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wTGl0ZWNvaW5zXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gTGl0ZWNvaW5zXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG4gICAgICAgIC8vYml0c3RhbXBFdXJvXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdHN0YW1wRXVyb1wiLFxuICAgICAgICAgICAgXCJCaXRzdGFtcCAtIFZlcmbDvGdiYXJlIEV1cm9cIixcbiAgICAgICAgICAgIFwiYml0c3RhbXBcIik7XG5cbiAgICAgICAgLy9iaXRzdGFtcEJUQ1xuICAgICAgICB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oXCJiaXRzdGFtcEJUQ1wiLFxuICAgICAgICAgICAgXCJCaXRzdGFtcCAtIEJpdGNvaW5zXCIsXG4gICAgICAgICAgICBcImJpdHN0YW1wXCIpO1xuXG5cbiAgICAgICAgLy9iaXRzdGFtcFJpcHBsZXNcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0c3RhbXBSaXBwbGVzXCIsXG4gICAgICAgICAgICBcIkJpdHN0YW1wIC0gUmlwcGxlc1wiLFxuICAgICAgICAgICAgXCJiaXRzdGFtcFwiKTtcblxuICAgICAgICAvL2NyZWF0ZSBiaXRmaW5leCBwb3J0Zm9saW8gaXRlbXNcbiAgICAgICAgLy9iaXRmaW5leElPVEFcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhJT1RBXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gSU9UQVwiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcblxuICAgICAgICAvL2JpdGZpbmV4QlRDXG4gICAgICAgIHRoaXMuY3JlYXRlUG9ydGZvbGlvSXRlbShcImJpdGZpbmV4QlRDXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gQml0Y29pbnNcIixcbiAgICAgICAgICAgIFwiYml0ZmluZXhcIik7XG5cbiAgICAgICAgLy9iaXRmaW5leERhc2hcbiAgICAgICAgdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKFwiYml0ZmluZXhEYXNoXCIsXG4gICAgICAgICAgICBcIkJpdGZpbmV4IC0gRGFzaFwiLFxuICAgICAgICAgICAgXCJiaXRmaW5leFwiKTtcbiAgICB9XG5cblxuICAgIGluaXRpYWxpemVQcmljZXMoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImx0Y1wiLCBcImV1clwiLCBcImJpdHN0YW1wXCIsIFwiTFRDL0VVUlwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0c3RhbXBcIiwgXCJCVEMvRVVSXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJ4cnBcIiwgXCJldXJcIiwgXCJiaXRzdGFtcFwiLCBcIlhSUC9FVVJcIik7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiaW90XCIsIFwiYnRjXCIsIFwiYml0ZmluZXhcIiwgXCJJT1RBL0JUQ1wiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiYnRjXCIsIFwiZXVyXCIsIFwiYml0ZmluZXhcIiwgXCJCVEMvRVVSXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJldGhcIiwgXCJ1c2RcIiwgXCJiaXRmaW5leFwiLCBcIkVUSC9VU0RcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImlvdFwiLCBcImV0aFwiLCBcImJpdGZpbmV4XCIsIFwiSU9UQS9FVEhcIik7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VJbmZvcm1hdGlvbihcImJ0Y1wiLCBcInVzZFwiLCBcImJpdGZpbmV4XCIsIFwiQlRDL1VTRFwiKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZUluZm9ybWF0aW9uKFwiZHNoXCIsIFwidXNkXCIsIFwiYml0ZmluZXhcIiwgXCJEU0gvVVNEXCIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVByaWNlSW5mb3JtYXRpb24oXCJkc2hcIiwgXCJidGNcIiwgXCJiaXRmaW5leFwiLCBcIkRTSC9CVENcIik7XG5cbiAgICAgICAgdGhpcy5zYXZlUHJpY2VJbmZvcm1hdGlvbigpO1xuICAgIH1cblxuICAgIGFkZE5ld1ByaWNlSW5mb3JtYXRpb24oKSB7XG5cbiAgICB9XG5cblxuICAgIGNyZWF0ZVByaWNlSW5mb3JtYXRpb24oZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ3VycmVuY3lQcmljZSB7XG4gICAgICAgIGxldCBuZXdDdXJyZW5jeVByaWNlID0gbmV3IEN1cnJlbmN5UHJpY2UoZnJvbSwgdG8sIHBsYXRmb3JtLCBkZXNjcmlwdGlvbik7XG5cbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0JpdHN0YW1wLnB1c2gobmV3Q3VycmVuY3lQcmljZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld0N1cnJlbmN5UHJpY2U7XG4gICAgfVxuXG4gICAgc2F2ZVByaWNlSW5mb3JtYXRpb24oKSB7XG4gICAgICAgIGxldCBwcmljZUluZm9ybWF0aW9uRGF0YVN0b3JhZ2UgPSB0aGlzLmN1cnJlbmN5UHJpY2VzQml0c3RhbXAuY29uY2F0KHRoaXMuY3VycmVuY3lQcmljZXNCaXRmaW5leCk7XG5cbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUHJpY2VJbmZvcm1hdGlvbkRhdGFcIixcbiAgICAgICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeShwcmljZUluZm9ybWF0aW9uRGF0YVN0b3JhZ2UpXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvL2NyZWF0ZSBtb2RhbCBoYW5kbGluZ1xuICAgIHNob3dDcmVhdGVQb3B1cCgpIHtcbiAgICAgICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBvcHRpb25zOiBNb2RhbERpYWxvZ09wdGlvbnMgPSB7XG4gICAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZjUmVmLFxuICAgICAgICAgICAgY29udGV4dDogdG9kYXkudG9EYXRlU3RyaW5nKCksXG4gICAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbFNlcnZpY2Uuc2hvd01vZGFsKENyZWF0ZU1vZGFsVmlld0NvbXBvbmVudCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY3JlYXRlUHJlc3NlZCgpIHtcbiAgICAgICAgdGhpcy5zaG93Q3JlYXRlUG9wdXAoKTtcbiAgICB9XG59Il19