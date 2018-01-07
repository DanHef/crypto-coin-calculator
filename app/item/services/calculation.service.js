"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CalculationResult_1 = require("../CalculationResult");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var portfolio_item_service_1 = require("./portfolio-item.service");
var currency_price_service_1 = require("./currency-price.service");
var item_service_1 = require("../item.service");
var CalculationService = (function () {
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
        var basicCurrencyPrice = this.currencyPriceService.getCurrencyPrice(sourceSymbol, targetSymbol, platform);
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
            //currently always go through BTC
            var currencyPriceBTC = this.currencyPriceService.getCurrencyPrice(sourceSymbol, "btc", platform);
            var promisePriceBTC;
            var promisePriceBTCTarget;
            //load data from platform for this path
            if (platform === "bitfinex") {
                promisePriceBTC = this.itemService.loadDataFromBitfinexWithSymbol(currencyPriceBTC);
            }
            else if (platform === "bitstamp") {
                promisePriceBTC = this.itemService.loadDataFromBitstampWithSymbol(currencyPriceBTC);
            }
            var currencyPriceBTCTarget = this.currencyPriceService.getCurrencyPrice("btc", targetSymbol, platform);
            if (platform === "bitfinex") {
                promisePriceBTCTarget = this.itemService.loadDataFromBitfinexWithSymbol(currencyPriceBTCTarget);
            }
            else if (platform === "bitstamp") {
                promisePriceBTCTarget = this.itemService.loadDataFromBitstampWithSymbol(currencyPriceBTCTarget);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhbGN1bGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFFM0MsMERBQXlEO0FBQ3pELDJFQUE0RDtBQUU1RCxtRUFBZ0U7QUFDaEUsbUVBQWdFO0FBQ2hFLGdEQUE4QztBQUk5QztJQUlJLDRCQUE2QixvQkFBMEMsRUFDbEQsb0JBQTBDLEVBQzFDLFdBQXdCO1FBRmhCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDbEQseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUxyQyx1QkFBa0IsR0FBNkIsRUFBRSxDQUFDO1FBQ2xELGtCQUFhLEdBQWtCLElBQUksMkNBQWEsRUFBRSxDQUFDO0lBSVYsQ0FBQztJQUVsRCxpREFBb0IsR0FBcEIsVUFBcUIsaUJBQWlCO1FBQ2xDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBR0Qsb0RBQXVCLEdBQXZCLFVBQXdCLHVCQUErQixFQUFFLG9CQUE0QixFQUNqRixXQUFtQixFQUFFLFFBQWdCO1FBQ3JDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQywrQkFBK0IsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqSCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxFQUFFLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTFILElBQUksb0JBQW9CLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUU1SCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFB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WSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgQ2FsY3VsYXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vQ2FsY3VsYXRpb25SZXN1bHRcIjtcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XG5cbmltcG9ydCB7IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vcG9ydGZvbGlvLWl0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgQ3VycmVuY3lQcmljZVNlcnZpY2UgfSBmcm9tIFwiLi9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuLi9pdGVtLnNlcnZpY2VcIjtcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FsY3VsYXRpb25TZXJ2aWNlIHtcbiAgICBwcml2YXRlIGNhbGN1bGF0aW9uUmVzdWx0czogQXJyYXk8Q2FsY3VsYXRpb25SZXN1bHQ+ID0gW107XG4gICAgcHJpdmF0ZSBzZWN1cmVTdG9yYWdlOiBTZWN1cmVTdG9yYWdlID0gbmV3IFNlY3VyZVN0b3JhZ2UoKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGN1cnJlbmN5UHJpY2VTZXJ2aWNlOiBDdXJyZW5jeVByaWNlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UpIHsgfVxuXG4gICAgYWRkQ2FsY3VsYXRpb25SZXN1bHQoY2FsY3VsYXRpb25SZXN1bHQpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblJlc3VsdHMucHVzaChjYWxjdWxhdGlvblJlc3VsdCk7XG4gICAgfVxuXG5cbiAgICBjcmVhdGVDYWxjdWxhdGlvblJlc3VsdChzb3VyY2VQb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nLCB0YXJnZXRDdXJyZW5jeVN5bWJvbDogc3RyaW5nLFxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ2FsY3VsYXRpb25SZXN1bHQge1xuICAgICAgICBsZXQgcG9ydGZvbGlvSXRlbSA9IHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2UuZ2V0UG9ydGZvbGlvSXRlbUJ5VGVjaG5pY2FsTmFtZShzb3VyY2VQb3J0Zm9saW9JdGVtTmFtZSwgcGxhdGZvcm0pO1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZSA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0Q3VycmVuY3lQcmljZShwb3J0Zm9saW9JdGVtLmdldFN5bWJvbCgpLCB0YXJnZXRDdXJyZW5jeVN5bWJvbCwgcGxhdGZvcm0pO1xuXG4gICAgICAgIGxldCBuZXdDYWxjdWxhdGlvblJlc3VsdCA9IG5ldyBDYWxjdWxhdGlvblJlc3VsdChkZXNjcmlwdGlvbiwgcG9ydGZvbGlvSXRlbSwgY3VycmVuY3lQcmljZSwgcGxhdGZvcm0sIHRhcmdldEN1cnJlbmN5U3ltYm9sKTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cy5wdXNoKG5ld0NhbGN1bGF0aW9uUmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gbmV3Q2FsY3VsYXRpb25SZXN1bHQ7XG4gICAgfVxuXG5cbiAgICBkZWxldGVDYWxjdWxhdGlvblJlc3VsdChjYWxjdWxhdGlvblJlc3VsdDogQ2FsY3VsYXRpb25SZXN1bHQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhbGNSZXN1bHQgPSB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0c1tpXTtcbiAgICAgICAgICAgIGlmIChjYWxjUmVzdWx0LmdldFBsYXRmb3JtKCkgPT09IGNhbGN1bGF0aW9uUmVzdWx0LmdldFBsYXRmb3JtKCkgJiZcbiAgICAgICAgICAgICAgICBjYWxjUmVzdWx0LmdldERlc2NyaXB0aW9uKCkgPT09IGNhbGN1bGF0aW9uUmVzdWx0LmdldERlc2NyaXB0aW9uKCkgJiZcbiAgICAgICAgICAgICAgICBjYWxjUmVzdWx0LmdldFRhcmdldEN1cnJlbmN5KCkgPT09IGNhbGN1bGF0aW9uUmVzdWx0LmdldFRhcmdldEN1cnJlbmN5KCkgJiZcbiAgICAgICAgICAgICAgICBjYWxjUmVzdWx0LmdldFNvdXJjZVBvcnRmb2xpb0l0ZW0oKSA9PT0gY2FsY3VsYXRpb25SZXN1bHQuZ2V0U291cmNlUG9ydGZvbGlvSXRlbSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGlvblJlc3VsdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBjYWxjdWxhdGVBbGxSZXN1bHRzKCk6IFByb21pc2U8Q2FsY3VsYXRpb25SZXN1bHRbXT4ge1xuICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmNhbGN1bGF0ZVJlc3VsdCh0aGlzLmNhbGN1bGF0aW9uUmVzdWx0c1tpXSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPENhbGN1bGF0aW9uUmVzdWx0W10+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5jYWxjdWxhdGlvblJlc3VsdHMpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVzdWx0KGNhbGN1bGF0aW9uUmVzdWx0OiBDYWxjdWxhdGlvblJlc3VsdCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxudW1iZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGV0ZXJtaW5lRGlyZWN0UHJpY2UoY2FsY3VsYXRpb25SZXN1bHQpLnRoZW4oKHByaWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjYWxjdWxhdGlvblJlc3VsdC5nZXRSZXN1bHQocHJpY2UpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRldGVybWluZURpcmVjdFByaWNlKGNhbGN1bGF0aW9uUmVzdWx0OiBDYWxjdWxhdGlvblJlc3VsdCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBzb3VyY2VTeW1ib2wgPSBjYWxjdWxhdGlvblJlc3VsdC5nZXRTb3VyY2VQb3J0Zm9saW9JdGVtKCkuZ2V0U3ltYm9sKCk7XG4gICAgICAgIGxldCB0YXJnZXRTeW1ib2wgPSBjYWxjdWxhdGlvblJlc3VsdC5nZXRUYXJnZXRDdXJyZW5jeSgpO1xuICAgICAgICBsZXQgcGxhdGZvcm0gPSBjYWxjdWxhdGlvblJlc3VsdC5nZXRQbGF0Zm9ybSgpO1xuXG4gICAgICAgIC8vdHJ5IHRvIGZpbmQgYSBkaXJlY3QgY3VycmVuY3kgcHJpY2VcbiAgICAgICAgbGV0IGJhc2ljQ3VycmVuY3lQcmljZSA9IHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuZ2V0Q3VycmVuY3lQcmljZShzb3VyY2VTeW1ib2wsIHRhcmdldFN5bWJvbCwgcGxhdGZvcm0pO1xuICAgICAgICBpZiAoIWJhc2ljQ3VycmVuY3lQcmljZSkge1xuICAgICAgICAgICAgLy9ubyBkaXJlY3QgY3VycmVuY3kgcHJpY2UgYXZhaWxhYmxlID0+IGZpbmQgZmFzdGVzdCByb3V0ZSB0byB0YXJnZXQgY3VycmVuY3lcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRldGVybWluZUZhc3Rlc3RDdXJyZW5jeVByaWNlKHNvdXJjZVN5bWJvbCwgdGFyZ2V0U3ltYm9sLCBwbGF0Zm9ybSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2RpcmVjdCBjdXJyZW5jeSBwcmljZSBhdmFpbGFibGUgPT4gcmV0dXJuIHRvIGNhbGxlclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPG51bWJlcj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoYmFzaWNDdXJyZW5jeVByaWNlLnByaWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmVGYXN0ZXN0Q3VycmVuY3lQcmljZShzb3VyY2VTeW1ib2w6IHN0cmluZywgdGFyZ2V0U3ltYm9sOiBzdHJpbmcsIHBsYXRmb3JtOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8bnVtYmVyPihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIC8vY3VycmVudGx5IGFsd2F5cyBnbyB0aHJvdWdoIEJUQ1xuICAgICAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2VCVEMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEN1cnJlbmN5UHJpY2Uoc291cmNlU3ltYm9sLCBcImJ0Y1wiLCBwbGF0Zm9ybSk7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZVByaWNlQlRDO1xuICAgICAgICAgICAgdmFyIHByb21pc2VQcmljZUJUQ1RhcmdldDtcblxuICAgICAgICAgICAgLy9sb2FkIGRhdGEgZnJvbSBwbGF0Zm9ybSBmb3IgdGhpcyBwYXRoXG4gICAgICAgICAgICBpZiAocGxhdGZvcm0gPT09IFwiYml0ZmluZXhcIikge1xuICAgICAgICAgICAgICAgIHByb21pc2VQcmljZUJUQyA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0ZmluZXhXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VCVEMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gXCJiaXRzdGFtcFwiKSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZVByaWNlQlRDID0gdGhpcy5pdGVtU2VydmljZS5sb2FkRGF0YUZyb21CaXRzdGFtcFdpdGhTeW1ib2woY3VycmVuY3lQcmljZUJUQyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjdXJyZW5jeVByaWNlQlRDVGFyZ2V0ID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXRDdXJyZW5jeVByaWNlKFwiYnRjXCIsIHRhcmdldFN5bWJvbCwgcGxhdGZvcm0pO1xuXG4gICAgICAgICAgICBpZiAocGxhdGZvcm0gPT09IFwiYml0ZmluZXhcIikge1xuICAgICAgICAgICAgICAgIHByb21pc2VQcmljZUJUQ1RhcmdldCA9IHRoaXMuaXRlbVNlcnZpY2UubG9hZERhdGFGcm9tQml0ZmluZXhXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2VCVENUYXJnZXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gXCJiaXRzdGFtcFwiKSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZVByaWNlQlRDVGFyZ2V0ID0gdGhpcy5pdGVtU2VydmljZS5sb2FkRGF0YUZyb21CaXRzdGFtcFdpdGhTeW1ib2woY3VycmVuY3lQcmljZUJUQ1RhcmdldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlUHJpY2VCVEMsIHByb21pc2VQcmljZUJUQ1RhcmdldF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY3VycmVuY3lQcmljZUJUQy5wcmljZSB8fCAhY3VycmVuY3lQcmljZUJUQ1RhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcHJpY2VTb3VyY2VCVEM7XG4gICAgICAgICAgICAgICAgbGV0IHByaWNlQlRDVGFyZ2V0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbmN5UHJpY2VCVEMuY3VycmVuY3lDb2RlVG8gPT09IHNvdXJjZVN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBwcmljZVNvdXJjZUJUQyA9IDEgLyBjdXJyZW5jeVByaWNlQlRDLnByaWNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByaWNlU291cmNlQlRDID0gY3VycmVuY3lQcmljZUJUQy5wcmljZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VycmVuY3lQcmljZUJUQ1RhcmdldC5jdXJyZW5jeUNvZGVGcm9tID09PSB0YXJnZXRTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VCVENUYXJnZXQgPSAxIC8gY3VycmVuY3lQcmljZUJUQ1RhcmdldC5wcmljZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmljZUJUQ1RhcmdldCA9IGN1cnJlbmN5UHJpY2VCVENUYXJnZXQucHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwcmljZVNvdXJjZUJUQyAqIHByaWNlQlRDVGFyZ2V0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGdldEFsbENhbGN1bGF0aW9uUmVzdWx0cygpOiBBcnJheTxDYWxjdWxhdGlvblJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGlvblJlc3VsdHM7XG4gICAgfVxuXG4gICAgLy9UT0RPOiBzYXZlIGFuZCBsb2FkIGhhdmUgdG8gYmUgcmVuZXdlZFxuXG4gICAgc2F2ZUNhbGN1bGF0aW9uUmVzdWx0cygpIHtcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjQ2FsY3VsYXRpb25SZXN1bHREYXRhXCIsXG4gICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkodGhpcy5jYWxjdWxhdGlvblJlc3VsdHMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWRDdXJyZW5jeVByaWNlcygpIHtcbiAgICAgICAgbGV0IHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0U3RyaW5nID0gdGhpcy5zZWN1cmVTdG9yYWdlLmdldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjQ2FsY3VsYXRpb25SZXN1bHREYXRhXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdG9yZWRDYWxjdWxhdGlvblJlc3VsdFN0cmluZykge1xuICAgICAgICAgICAgbGV0IHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0cyA9IEpTT04ucGFyc2Uoc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHRTdHJpbmcpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzdG9yZWRDYWxjdWxhdGlvblJlc3VsdCA9IHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0c1tpXTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ2FsY3VsYXRpb25SZXN1bHQoc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHQuc291cmNlUG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHQudGFyZ2V0Q3VycmVuY3ksXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZWRDYWxjdWxhdGlvblJlc3VsdC5wbGF0Zm9ybSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iXX0=