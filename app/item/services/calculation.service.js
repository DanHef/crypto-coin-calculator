"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CalculationResult_1 = require("../CalculationResult");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var portfolio_item_service_1 = require("./portfolio-item.service");
var currency_price_service_1 = require("./currency-price.service");
var item_service_1 = require("../item.service");
var CurrencyPrice_1 = require("../CurrencyPrice");
var CalculationService = /** @class */ (function () {
    function CalculationService(portfolioItemService, currencyPriceService, itemService) {
        this.portfolioItemService = portfolioItemService;
        this.currencyPriceService = currencyPriceService;
        this.itemService = itemService;
        this.calculationResults = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
    }
    CalculationService.prototype.addCalculationResult = function (calculationResult) {
        this.calculationResults.push(calculationResult);
    };
    CalculationService.prototype.createCalculationResult = function (sourcePortfolioItemName, targetCurrencySymbol, description, platform) {
        var portfolioItem = this.portfolioItemService.getPortfolioItemByTechnicalName(sourcePortfolioItemName, platform);
        var currencyPrice = this.currencyPriceService.getCurrencyPrice(portfolioItem.getSymbol(), targetCurrencySymbol, platform);
        var newCalculationResult = new CalculationResult_1.CalculationResult(description, portfolioItem, currencyPrice, platform, targetCurrencySymbol);
        this.calculationResults.push(newCalculationResult);
        return newCalculationResult;
    };
    CalculationService.prototype.deleteCalculationResult = function (calculationResult) {
        for (var i = 0; i < this.calculationResults.length; i++) {
            var calcResult = this.calculationResults[i];
            if (calcResult.getPlatform() === calculationResult.getPlatform() &&
                calcResult.getDescription() === calculationResult.getDescription() &&
                calcResult.getTargetCurrency() === calculationResult.getTargetCurrency() &&
                calcResult.getSourcePortfolioItem() === calculationResult.getSourcePortfolioItem()) {
                this.calculationResults.splice(i, 1);
            }
        }
    };
    CalculationService.prototype.calculateAllResults = function () {
        var _this = this;
        var promises = [];
        for (var i = 0; i < this.calculationResults.length; i++) {
            promises.push(this.calculateResult(this.calculationResults[i]));
        }
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function () {
                resolve(this.calculationResults);
            }.bind(_this));
        });
    };
    CalculationService.prototype.calculateResult = function (calculationResult) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.determineDirectPrice(calculationResult).then(function (price) {
                resolve(calculationResult.getResult(price));
            });
        });
    };
    CalculationService.prototype.determineDirectPrice = function (calculationResult) {
        var sourceSymbol = calculationResult.getSourcePortfolioItem().getSymbol();
        var targetSymbol = calculationResult.getTargetCurrency();
        var platform = calculationResult.getPlatform();
        //try to find a direct currency price
        var basicCurrencyPrice = this.currencyPriceService.getCurrencyPriceForDisplay(sourceSymbol, targetSymbol, platform);
        if (!basicCurrencyPrice) {
            //no direct currency price available => find fastest route to target currency
            return this.determineFastestCurrencyPrice(sourceSymbol, targetSymbol, platform);
        }
        else {
            //direct currency price available => return to caller
            return new Promise(function (resolve, reject) {
                resolve(basicCurrencyPrice.price);
            });
        }
    };
    CalculationService.prototype.determineFastestCurrencyPrice = function (sourceSymbol, targetSymbol, platform) {
        return new Promise(function (resolve, reject) {
            var currencyPriceBTC;
            if (sourceSymbol !== "btc") {
                //currently always go through BTC
                currencyPriceBTC = this.currencyPriceService.getCurrencyPrice(sourceSymbol, "btc", platform);
                var promisePriceBTC;
                var promisePriceBTCTarget;
                //load data from platform for this path
                if (platform === "bitfinex") {
                    promisePriceBTC = this.itemService.loadDataFromBitfinexWithSymbol(currencyPriceBTC);
                }
                else if (platform === "bitstamp") {
                    promisePriceBTC = this.itemService.loadDataFromBitstampWithSymbol(currencyPriceBTC);
                }
            }
            else {
                promisePriceBTC = new Promise(function (resolve, reject) {
                    currencyPriceBTC = new CurrencyPrice_1.CurrencyPrice("btc", "btc", platform);
                    currencyPriceBTC.setPrice(1);
                    resolve(currencyPriceBTC);
                });
            }
            var currencyPriceBTCTarget;
            if (targetSymbol !== "btc") {
                currencyPriceBTCTarget = this.currencyPriceService.getCurrencyPrice("btc", targetSymbol, platform);
                if (platform === "bitfinex") {
                    promisePriceBTCTarget = this.itemService.loadDataFromBitfinexWithSymbol(currencyPriceBTCTarget);
                }
                else if (platform === "bitstamp") {
                    promisePriceBTCTarget = this.itemService.loadDataFromBitstampWithSymbol(currencyPriceBTCTarget);
                }
            }
            else {
                promisePriceBTCTarget = new Promise(function (resolve, reject) {
                    currencyPriceBTCTarget = new CurrencyPrice_1.CurrencyPrice("btc", "btc", platform);
                    currencyPriceBTCTarget.setPrice(1);
                    resolve(currencyPriceBTCTarget);
                });
            }
            Promise.all([promisePriceBTC, promisePriceBTCTarget]).then(function () {
                if (!currencyPriceBTC.price || !currencyPriceBTCTarget) {
                    return 0;
                }
                var priceSourceBTC;
                var priceBTCTarget;
                if (currencyPriceBTC.currencyCodeTo === sourceSymbol) {
                    priceSourceBTC = 1 / currencyPriceBTC.price;
                }
                else {
                    priceSourceBTC = currencyPriceBTC.price;
                }
                if (currencyPriceBTCTarget.currencyCodeFrom === targetSymbol) {
                    priceBTCTarget = 1 / currencyPriceBTCTarget.price;
                }
                else {
                    priceBTCTarget = currencyPriceBTCTarget.price;
                }
                resolve(priceSourceBTC * priceBTCTarget);
            });
        }.bind(this));
    };
    CalculationService.prototype.getAllCalculationResults = function () {
        return this.calculationResults;
    };
    //TODO: save and load have to be renewed
    CalculationService.prototype.saveCalculationResults = function () {
        this.secureStorage.setSync({
            key: "cryptoCoinCalcCalculationResultData",
            value: JSON.stringify(this.calculationResults)
        });
    };
    CalculationService.prototype.loadCurrencyPrices = function () {
        var storedCalculationResultString = this.secureStorage.getSync({
            key: "cryptoCoinCalcCalculationResultData",
        });
        if (storedCalculationResultString) {
            var storedCalculationResults = JSON.parse(storedCalculationResultString);
            for (var i = 0; i < storedCalculationResults.length; i++) {
                var storedCalculationResult = storedCalculationResults[i];
                this.createCalculationResult(storedCalculationResult.sourcePortfolioItem.portfolioItemName, storedCalculationResult.targetCurrency, storedCalculationResult.description, storedCalculationResult.platform);
            }
        }
    };
    CalculationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [portfolio_item_service_1.PortfolioItemService,
            currency_price_service_1.CurrencyPriceService,
            item_service_1.ItemService])
    ], CalculationService);
    return CalculationService;
}());
exports.CalculationService = CalculationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhbGN1bGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFFM0MsMERBQXlEO0FBQ3pELDJFQUE0RDtBQUU1RCxtRUFBZ0U7QUFDaEUsbUVBQWdFO0FBQ2hFLGdEQUE4QztBQUU5QyxrREFBZ0Q7QUFJaEQ7SUFJSSw0QkFBNkIsb0JBQTBDLEVBQ2xELG9CQUEwQyxFQUMxQyxXQUF3QjtRQUZoQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQ2xELHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFMckMsdUJBQWtCLEdBQTZCLEVBQUUsQ0FBQztRQUNsRCxrQkFBYSxHQUFrQixJQUFJLDJDQUFhLEVBQUUsQ0FBQztJQUlWLENBQUM7SUFFbEQsaURBQW9CLEdBQXBCLFVBQXFCLGlCQUFpQjtRQUNsQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUdELG9EQUF1QixHQUF2QixVQUF3Qix1QkFBK0IsRUFBRSxvQkFBNEIsRUFDakYsV0FBbUIsRUFBRSxRQUFnQjtRQUNyQyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsK0JBQStCLENBQUMsdUJBQXVCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakgsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUxSCxJQUFJLG9CQUFvQixHQUFHLElBQUkscUNBQWlCLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFFNUgsSUFBSSxDQUFDLGtC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Qyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUV6QztTQUNKO0lBQ0wsQ0FBQztJQWhMUSxrQkFBa0I7UUFEOUIsaUJBQVUsRUFBRTt5Q0FLMEMsNkNBQW9CO1lBQzVCLDZDQUFvQjtZQUM3QiwwQkFBVztPQU5wQyxrQkFBa0IsQ0FpTDlCO0lBQUQseUJBQUM7Q0FBQSxBQWpMRCxJQWlMQztBQWpMWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgQ2FsY3VsYXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vQ2FsY3VsYXRpb25SZXN1bHRcIjtcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XG5cbmltcG9ydCB7IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vcG9ydGZvbGlvLWl0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgQ3VycmVuY3lQcmljZVNlcnZpY2UgfSBmcm9tIFwiLi9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuLi9pdGVtLnNlcnZpY2VcIjtcblxuaW1wb3J0IHtDdXJyZW5jeVByaWNlIH0gZnJvbSBcIi4uL0N1cnJlbmN5UHJpY2VcIjtcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FsY3VsYXRpb25TZXJ2aWNlIHtcbiAgICBwcml2YXRlIGNhbGN1bGF0aW9uUmVzdWx0czogQXJyYXk8Q2FsY3VsYXRpb25SZXN1bHQ+ID0gW107XG4gICAgcHJpdmF0ZSBzZWN1cmVTdG9yYWdlOiBTZWN1cmVTdG9yYWdlID0gbmV3IFNlY3VyZVN0b3JhZ2UoKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGN1cnJlbmN5UHJpY2VTZXJ2aWNlOiBDdXJyZW5jeVByaWNlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UpIHsgfVxuXG4gICAgYWRkQ2FsY3VsYXRpb25SZXN1bHQoY2FsY3VsYXRpb25SZXN1bHQpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblJlc3VsdHMucHVzaChjYWxjdWxhdGlvblJlc3VsdCk7XG4gICAgfVxuXG5cbiAgICBjcmVhdGVDYWxjdWxhdGlvblJlc3VsdChzb3VyY2VQb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCB0YXJnZXRDdXJyZW5jeVN5bWJvbDogc3RyaW5nLFxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ2FsY3VsYXRpb25SZXN1bHQge1xuICAgICAgICBsZXQgcG9ydGZvbGlvSXRlbSA9IHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZ2V0UG9ydGZvbGlvSXRlbUJ5VGVjaG5pY2FsTmFtZShzb3VyY2VQb3J0Zm9saW9JdGVtTmFtZSwgcGxhdGZvcm0pO1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZSA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0Q3VycmVuY3lQcmljZShwb3J0Zm9saW9JdGVtLmdldFN5bWJvbCgpLCB0YXJnZXRDdXJyZW5jeVN5bWJvbCwgcGxhdGZvcm0pO1xuXG4gICAgICAgIGxldCBuZXdDYWxjdWxhdGlvblJlc3VsdCA9IG5ldyBDYWxjdWxhdGlvblJlc3VsdChkZXNjcmlwdGlvbiwgcG9ydGZvbGlvSXRlbSwgY3VycmVuY3lQcmljZSwgcGxhdGZvcm0sIHRhcmdldEN1cnJlbmN5U3ltYm9sKTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cy5wdXNoKG5ld0NhbGN1bGF0aW9uUmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gbmV3Q2FsY3VsYXRpb25SZXN1bHQ7XG4gICAgfVxuXG5cbiAgICBkZWxldGVDYWxjdWxhdGlvblJlc3VsdChjYWxjdWxhdGlvblJlc3VsdDogQ2FsY3VsYXRpb25SZXN1bHQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhbGNSZXN1bHQgPSB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0c1tpXTtcbiAgICAgICAgICAgIGlmIChjYWxjUmVzdWx0LmdldFBsYXRmb3JtKCkgPT09IGNhbGN1bGF0aW9uUmVzdWx0LmdldFBsYXRmb3JtKCkgJiZcbiAgICAgICAgICAgICAgICBjYWxjUmVzdWx0LmdldERlc2NyaXB0aW9uKCkgPT09IGNhbGN1bGF0aW9uUmVzdWx0LmdldERlc2NyaXB0aW9uKCkgJiZcbiAgICAgICAgICAgICAgICBjYWxjUmVzdWx0LmdldFRhcmdldEN1cnJlbmN5KCkgPT09IGNhbGN1bGF0aW9uUmVzdWx0LmdldFRhcmdldEN1cnJlbmN5KCkgJiZcbiAgICAgICAgICAgICAgICBjYWxjUmVzdWx0LmdldFNvdXJjZVBvcnRmb2xpb0l0ZW0oKSA9PT0gY2FsY3VsYXRpb25SZXN1bHQuZ2V0U291cmNlUG9ydGZvbGlvSXRlbSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGlvblJlc3VsdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBjYWxjdWxhdGVBbGxSZXN1bHRzKCk6IFByb21pc2U8Q2FsY3VsYXRpb25SZXN1bHRbXT4ge1xuICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmNhbGN1bGF0ZVJlc3VsdCh0aGlzLmNhbGN1bGF0aW9uUmVzdWx0c1tpXSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPENhbGN1bGF0aW9uUmVzdWx0W10+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5jYWxjdWxhdGlvblJlc3VsdHMpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVzdWx0KGNhbGN1bGF0aW9uUmVzdWx0OiBDYWxjdWxhdGlvblJlc3VsdCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxudW1iZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGV0ZXJtaW5lRGlyZWN0UHJpY2UoY2FsY3VsYXRpb25SZXN1bHQpLnRoZW4oKHByaWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjYWxjdWxhdGlvblJlc3VsdC5nZXRSZXN1bHQocHJpY2UpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRldGVybWluZURpcmVjdFByaWNlKGNhbGN1bGF0aW9uUmVzdWx0OiBDYWxjdWxhdGlvblJlc3VsdCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBzb3VyY2VTeW1ib2wgPSBjYWxjdWxhdGlvblJlc3VsdC5nZXRTb3VyY2VQb3J0Zm9saW9JdGVtKCkuZ2V0U3ltYm9sKCk7XG4gICAgICAgIGxldCB0YXJnZXRTeW1ib2wgPSBjYWxjdWxhdGlvblJlc3VsdC5nZXRUYXJnZXRDdXJyZW5jeSgpO1xuICAgICAgICBsZXQgcGxhdGZvcm0gPSBjYWxjdWxhdGlvblJlc3VsdC5nZXRQbGF0Zm9ybSgpO1xuXG4gICAgICAgIC8vdHJ5IHRvIGZpbmQgYSBkaXJlY3QgY3VycmVuY3kgcHJpY2VcbiAgICAgICAgbGV0IGJhc2ljQ3VycmVuY3lQcmljZSA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0Q3VycmVuY3lQcmljZUZvckRpc3BsYXkoc291cmNlU3ltYm9sLCB0YXJnZXRTeW1ib2wsIHBsYXRmb3JtKTtcbiAgICAgICAgaWYgKCFiYXNpY0N1cnJlbmN5UHJpY2UpIHtcbiAgICAgICAgICAgIC8vbm8gZGlyZWN0IGN1cnJlbmN5IHByaWNlIGF2YWlsYWJsZSA9PiBmaW5kIGZhc3Rlc3Qgcm91dGUgdG8gdGFyZ2V0IGN1cnJlbmN5XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZXRlcm1pbmVGYXN0ZXN0Q3VycmVuY3lQcmljZShzb3VyY2VTeW1ib2wsIHRhcmdldFN5bWJvbCwgcGxhdGZvcm0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9kaXJlY3QgY3VycmVuY3kgcHJpY2UgYXZhaWxhYmxlID0+IHJldHVybiB0byBjYWxsZXJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxudW1iZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGJhc2ljQ3VycmVuY3lQcmljZS5wcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGV0ZXJtaW5lRmFzdGVzdEN1cnJlbmN5UHJpY2Uoc291cmNlU3ltYm9sOiBzdHJpbmcsIHRhcmdldFN5bWJvbDogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPG51bWJlcj4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBsZXQgY3VycmVuY3lQcmljZUJUQztcbiAgICAgICAgICAgIGlmKHNvdXJjZVN5bWJvbCAhPT0gXCJidGNcIikge1xuICAgICAgICAgICAgICAgIC8vY3VycmVudGx5IGFsd2F5cyBnbyB0aHJvdWdoIEJUQ1xuICAgICAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VCVEMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEN1cnJlbmN5UHJpY2Uoc291cmNlU3ltYm9sLCBcImJ0Y1wiLCBwbGF0Zm9ybSk7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2VQcmljZUJUQztcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZVByaWNlQlRDVGFyZ2V0O1xuXG4gICAgICAgICAgICAgICAgLy9sb2FkIGRhdGEgZnJvbSBwbGF0Zm9ybSBmb3IgdGhpcyBwYXRoXG4gICAgICAgICAgICAgICAgaWYgKHBsYXRmb3JtID09PSBcImJpdGZpbmV4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZVByaWNlQlRDID0gdGhpcy5pdGVtU2VydmljZS5sb2FkRGF0YUZyb21CaXRmaW5leFdpdGhTeW1ib2woY3VycmVuY3lQcmljZUJUQyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gXCJiaXRzdGFtcFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VQcmljZUJUQyA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0c3RhbXBXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VCVEMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZVByaWNlQlRDID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlQlRDID0gbmV3IEN1cnJlbmN5UHJpY2UoXCJidGNcIiwgXCJidGNcIiwgcGxhdGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlQlRDLnNldFByaWNlKDEpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGN1cnJlbmN5UHJpY2VCVEMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgY3VycmVuY3lQcmljZUJUQ1RhcmdldDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYodGFyZ2V0U3ltYm9sICE9PSBcImJ0Y1wiKSB7XG4gICAgICAgICAgICAgICAgY3VycmVuY3lQcmljZUJUQ1RhcmdldCA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0Q3VycmVuY3lQcmljZShcImJ0Y1wiLCB0YXJnZXRTeW1ib2wsIHBsYXRmb3JtKTtcblxuICAgICAgICAgICAgaWYgKHBsYXRmb3JtID09PSBcImJpdGZpbmV4XCIpIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlUHJpY2VCVENUYXJnZXQgPSB0aGlzLml0ZW1TZXJ2aWNlLmxvYWREYXRhRnJvbUJpdGZpbmV4V2l0aFN5bWJvbChjdXJyZW5jeVByaWNlQlRDVGFyZ2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGxhdGZvcm0gPT09IFwiYml0c3RhbXBcIikge1xuICAgICAgICAgICAgICAgIHByb21pc2VQcmljZUJUQ1RhcmdldCA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0c3RhbXBXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VCVENUYXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZVByaWNlQlRDVGFyZ2V0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VCVENUYXJnZXQgPSBuZXcgQ3VycmVuY3lQcmljZShcImJ0Y1wiLCBcImJ0Y1wiLCBwbGF0Zm9ybSk7XG4gICAgICAgICAgICAgICAgY3VycmVuY3lQcmljZUJUQ1RhcmdldC5zZXRQcmljZSgxKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGN1cnJlbmN5UHJpY2VCVENUYXJnZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW3Byb21pc2VQcmljZUJUQywgcHJvbWlzZVByaWNlQlRDVGFyZ2V0XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJyZW5jeVByaWNlQlRDLnByaWNlIHx8ICFjdXJyZW5jeVByaWNlQlRDVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBwcmljZVNvdXJjZUJUQztcbiAgICAgICAgICAgICAgICBsZXQgcHJpY2VCVENUYXJnZXQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VycmVuY3lQcmljZUJUQy5jdXJyZW5jeUNvZGVUbyA9PT0gc291cmNlU3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaWNlU291cmNlQlRDID0gMSAvIGN1cnJlbmN5UHJpY2VCVEMucHJpY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VTb3VyY2VCVEMgPSBjdXJyZW5jeVByaWNlQlRDLnByaWNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW5jeVByaWNlQlRDVGFyZ2V0LmN1cnJlbmN5Q29kZUZyb20gPT09IHRhcmdldFN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBwcmljZUJUQ1RhcmdldCA9IDEgLyBjdXJyZW5jeVByaWNlQlRDVGFyZ2V0LnByaWNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByaWNlQlRDVGFyZ2V0ID0gY3VycmVuY3lQcmljZUJUQ1RhcmdldC5wcmljZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHByaWNlU291cmNlQlRDICogcHJpY2VCVENUYXJnZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgZ2V0QWxsQ2FsY3VsYXRpb25SZXN1bHRzKCk6IEFycmF5PENhbGN1bGF0aW9uUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cztcbiAgICB9XG5cbiAgICAvL1RPRE86IHNhdmUgYW5kIGxvYWQgaGF2ZSB0byBiZSByZW5ld2VkXG5cbiAgICBzYXZlQ2FsY3VsYXRpb25SZXN1bHRzKCkge1xuICAgICAgICB0aGlzLnNlY3VyZVN0b3JhZ2Uuc2V0U3luYyh7XG4gICAgICAgICAgICBrZXk6IFwiY3J5cHRvQ29pbkNhbGNDYWxjdWxhdGlvblJlc3VsdERhdGFcIixcbiAgICAgICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZEN1cnJlbmN5UHJpY2VzKCkge1xuICAgICAgICBsZXQgc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHRTdHJpbmcgPSB0aGlzLnNlY3VyZVN0b3JhZ2UuZ2V0U3luYyh7XG4gICAgICAgICAgICBrZXk6IFwiY3J5cHRvQ29pbkNhbGNDYWxjdWxhdGlvblJlc3VsdERhdGFcIixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0U3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHRzID0gSlNPTi5wYXJzZShzdG9yZWRDYWxjdWxhdGlvblJlc3VsdFN0cmluZyk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0ID0gc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHRzW2ldO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVDYWxjdWxhdGlvblJlc3VsdChzdG9yZWRDYWxjdWxhdGlvblJlc3VsdC5zb3VyY2VQb3J0Zm9saW9JdGVtLnBvcnRmb2xpb0l0ZW1OYW1lLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZWRDYWxjdWxhdGlvblJlc3VsdC50YXJnZXRDdXJyZW5jeSxcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHQuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0LnBsYXRmb3JtKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==