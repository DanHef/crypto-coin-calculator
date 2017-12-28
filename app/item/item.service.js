"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var ItemService = (function () {
    function ItemService(http) {
        this.http = http;
    }
    ItemService.prototype.loadDataFromBitfinexWithSymbol = function (currencyPrice) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/" + currencyPrice.getSymbol()).subscribe(function (result) {
                currencyPrice.setPrice(result.json().last_price);
                resolve(currencyPrice);
            });
        });
    };
    /*loadDataFromBitfinex(from: string, to: string): Promise<CurrencyPrice> {
        return this.loadDataFromBitfinexWithSymbol(new CurrencyPrice(from, to, "bitstamp"));
    }*/
    ItemService.prototype.loadDataFromBitstampWithSymbol = function (currencyPrice) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://www.bitstamp.net/api/v2/ticker/" + currencyPrice.getSymbol()).subscribe(function (result) {
                currencyPrice.setPrice(result.json().last);
                resolve(currencyPrice);
            });
        });
    };
    /*loadDataFromBitstamp(from: string, to: string): Promise<CurrencyPrice> {
        return this.loadDataFromBitstampWithSymbol(new CurrencyPrice(from,to, "bitfinex"));
    }*/
    ItemService.prototype.loadIotaBTCData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/iotbtc").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadBTCEuroData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/btceur").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadETHUSDData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/ethusd").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadIOTAETHData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/ioteth").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadBTCUSDData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/btcusd").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadDashUSDData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/dshusd").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadDashBTCData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/dshbtc").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ItemService);
    return ItemService;
}());
exports.ItemService = ItemService;
