"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoinPortfolioItem = (function () {
    function CoinPortfolioItem() {
        this.quantity = 0;
    }
    CoinPortfolioItem.prototype.getQuantity = function () {
        return this.quantity;
    };
    CoinPortfolioItem.prototype.setQuantity = function (quantity) {
        this.quantity = quantity;
    };
    CoinPortfolioItem.prototype.getPortfolioName = function () {
        return this.portfolioName;
    };
    CoinPortfolioItem.prototype.setPortfolioName = function (portfolioName) {
        this.portfolioName = portfolioName;
    };
    CoinPortfolioItem.prototype.getPortfolioItemName = function () {
        return this.portfolioItemName;
    };
    CoinPortfolioItem.prototype.setPortfolioItemName = function (portfolioItemName) {
        this.portfolioItemName = portfolioItemName;
    };
    CoinPortfolioItem.prototype.getPortfolioItemDescription = function () {
        return this.portfolioItemDescription;
    };
    CoinPortfolioItem.prototype.setPortfolioItemDescription = function (portfolioItemDescription) {
        this.portfolioItemDescription = portfolioItemDescription;
    };
    return CoinPortfolioItem;
}());
exports.CoinPortfolioItem = CoinPortfolioItem;
