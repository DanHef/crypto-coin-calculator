"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var CurrencyPrice_1 = require("./CurrencyPrice");
var CoinPortfolioItem_1 = require("./CoinPortfolioItem");
var item_service_1 = require("./item.service");
var Admob = require("nativescript-admob");
var ItemsComponent = (function () {
    function ItemsComponent(itemService) {
        this.itemService = itemService;
        this.currencyPricesBitstamp = [new CurrencyPrice_1.CurrencyPrice("ltc", "eur", "bitstamp", "LTC/EUR"),
            new CurrencyPrice_1.CurrencyPrice("btc", "eur", "bitstamp", "BTC/EUR"),
            new CurrencyPrice_1.CurrencyPrice("xrp", "eur", "bitstamp", "XRP/EUR")];
        this.currencyPricesBitfinex = [new CurrencyPrice_1.CurrencyPrice("iot", "btc", "bitfinex", "IOTA/BTC"),
            new CurrencyPrice_1.CurrencyPrice("btc", "eur", "bitfinex", "BTC/EUR"),
            new CurrencyPrice_1.CurrencyPrice("eth", "usd", "bitfinex", "ETH/USD"),
            new CurrencyPrice_1.CurrencyPrice("iot", "eth", "bitfinex", "IOTA/ETH"),
            new CurrencyPrice_1.CurrencyPrice("btc", "usd", "bitfinex", "BTC/USD"),
            new CurrencyPrice_1.CurrencyPrice("dsh", "usd", "bitfinex", "DSH/USD"),
            new CurrencyPrice_1.CurrencyPrice("dsh", "btc", "bitfinex", "DSH/BTC")];
        this.coinPortfolio = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
        //private androidBannerId: string = "ca-app-pub-XXXX/YYYY";
        //private androidInterstitialId: string = "ca-app-pub-KKKK/LLLL";
        this.iosBannerId = "ca-app-pub-3704439085032082/3863903252";
        this.iosInterstitialId = "ca-app-pub-3704439085032082/6212479394";
    }
    ItemsComponent.prototype.createBanner = function () {
        Admob.createBanner({
            testing: true,
            size: Admob.AD_SIZE.SMART_BANNER,
            iosBannerId: this.iosBannerId,
            //androidBannerId: this.androidBannerId,
            iosTestDeviceIds: ["9FE3C4E8-C7DB-40EB-BCCD-84A43050EEAB"],
            margins: {
                bottom: 0
            }
        }).then(function () {
            console.log("admob createBanner done");
        }, function (error) {
            console.log("admob createBanner error: " + error);
        });
    };
    ItemsComponent.prototype.createInterstitial = function () {
        Admob.createInterstitial({
            testing: true,
            iosInterstitialId: this.iosInterstitialId,
            //androidInterstitialId: this.androidInterstitialId,
            iosTestDeviceIds: ["9FE3C4E8-C7DB-40EB-BCCD-84A43050EEAB"]
        }).then(function () {
            console.log("admob createInterstitial done");
        }, function (error) {
            console.log("admob createInterstitial error: " + error);
        });
    };
    ItemsComponent.prototype.ngOnInit = function () {
        this.createBanner();
        this.initializePortfolio();
        this.readSecureStorage();
        this.refreshBitfinexData();
        this.refreshBitstampData();
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
        /*var success = this.secureStorage.removeSync({
            key: "cryptoCoinCalcPortfolio"
        });*/
        var storedPortfolioString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPortfolio",
        });
        if (storedPortfolioString) {
            var storedPortfolio = JSON.parse(storedPortfolioString);
            for (var i = 0; i < storedPortfolio.length; i++) {
                var storedPortfolioItem = storedPortfolio[i];
                var portfolioItem = this.getCoinPortfolioItem(storedPortfolioItem.portfolioItemName, storedPortfolioItem.portfolio);
                portfolioItem.setQuantity(storedPortfolioItem.quantity);
            }
        }
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
    ItemsComponent = __decorate([
        core_1.Component({
            selector: "ns-items",
            moduleId: module.id,
            templateUrl: "./items.component.html",
        }),
        __metadata("design:paramtypes", [item_service_1.ItemService])
    ], ItemsComponent);
    return ItemsComponent;
}());
exports.ItemsComponent = ItemsComponent;
