"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CurrencyPrice = (function () {
    function CurrencyPrice(codeFrom, codeTo, platform, description) {
        this.currencyCodeFrom = codeFrom;
        this.currencyCodeTo = codeTo;
        this.platform = platform;
        this.currencyPriceDescription = description;
    }
    ;
    CurrencyPrice.prototype.getSymbol = function () {
        return this.currencyCodeFrom + this.currencyCodeTo;
    };
    CurrencyPrice.prototype.setPrice = function (newPrice) {
        this.price = newPrice;
    };
    return CurrencyPrice;
}());
exports.CurrencyPrice = CurrencyPrice;
