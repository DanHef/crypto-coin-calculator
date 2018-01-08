"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CurrencyPrice_1 = require("../CurrencyPrice");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var platform_service_1 = require("./platform.service");
var CurrencyPriceService = (function () {
    function CurrencyPriceService(platformService) {
        this.platformService = platformService;
        this.currencyPrices = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
        this.currencyPricesChanged = new core_1.EventEmitter();
    }
    CurrencyPriceService.prototype.addCurrencyPrice = function (currencyPrice) {
        this.currencyPrices.push(currencyPrice);
    };
    CurrencyPriceService.prototype.createCurrencyPrice = function (codeFrom, codeTo, description, platform) {
        var newCurrencyPrice = new CurrencyPrice_1.CurrencyPrice(codeFrom, codeTo, platform);
        newCurrencyPrice.setDescription(description);
        this.currencyPrices.push(newCurrencyPrice);
        this.currencyPricesChanged.emit({
            data: null,
            message: null,
            notification: null
        });
        return newCurrencyPrice;
    };
    CurrencyPriceService.prototype.deleteCurrencyPrice = function (currencyPrice) {
        for (var i = 0; i < this.currencyPrices.length; i++) {
            var currentCurrencyPrice = this.currencyPrices[i];
            if (currentCurrencyPrice.platform === currencyPrice.platform &&
                currentCurrencyPrice.currencyCodeFrom === currencyPrice.currencyCodeFrom &&
                currentCurrencyPrice.currencyCodeTo === currencyPrice.currencyCodeTo) {
                this.currencyPrices.splice(i, 1);
                this.currencyPricesChanged.emit({
                    data: null,
                    message: null,
                    notification: null
                });
            }
        }
    };
    CurrencyPriceService.prototype.getAllCurrencyPrices = function (platform) {
        var currencyPrices;
        if (platform) {
            currencyPrices = [];
            for (var i = 0; i < this.currencyPrices.length; i++) {
                if (this.currencyPrices[i].platform === platform && this.currencyPrices[i].getDescription()) {
                    currencyPrices.push(this.currencyPrices[i]);
                }
            }
        }
        else {
            currencyPrices = this.currencyPrices;
        }
        return currencyPrices;
    };
    CurrencyPriceService.prototype.getAllCurrencyPricesIgnoringDisplaySetting = function (platform) {
        var currencyPrices;
        if (platform) {
            currencyPrices = [];
            for (var i = 0; i < this.currencyPrices.length; i++) {
                if (this.currencyPrices[i].platform === platform) {
                    currencyPrices.push(this.currencyPrices[i]);
                }
            }
        }
        else {
            currencyPrices = this.currencyPrices;
        }
        return currencyPrices;
    };
    CurrencyPriceService.prototype.getCurrencyPriceAmount = function (codeFrom, codeTo, platform) {
        for (var i = 0; i < this.currencyPrices.length; i++) {
            if (this.currencyPrices[i].currencyCodeFrom === codeFrom &&
                this.currencyPrices[i].currencyCodeTo === codeTo &&
                this.currencyPrices[i].platform === platform) {
                return this.currencyPrices[i].price;
            }
        }
    };
    CurrencyPriceService.prototype.getCurrencyPrice = function (codeFrom, codeTo, platform) {
        for (var i = 0; i < this.currencyPrices.length; i++) {
            if ((this.currencyPrices[i].currencyCodeFrom === codeFrom &&
                this.currencyPrices[i].currencyCodeTo === codeTo) ||
                (this.currencyPrices[i].currencyCodeFrom === codeTo &&
                    this.currencyPrices[i].currencyCodeTo === codeFrom) &&
                    this.currencyPrices[i].platform === platform) {
                return this.currencyPrices[i];
            }
        }
    };
    CurrencyPriceService.prototype.getCurrencyPriceForDisplay = function (codeFrom, codeTo, platform) {
        var currencyPrice = this.getCurrencyPrice(codeFrom, codeTo, platform);
        if (!currencyPrice) {
            return null;
        }
        if (currencyPrice.getDescription() != undefined) {
            return currencyPrice;
        }
        else {
            return null;
        }
    };
    CurrencyPriceService.prototype.saveCurrencyPrices = function () {
        this.secureStorage.setSync({
            key: "cryptoCoinCalcPriceInformationData",
            value: JSON.stringify(this.currencyPrices)
        });
    };
    CurrencyPriceService.prototype.loadCurrencyPrices = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadCurrencyPricesFromPlatform().then(function (allCurrencyPrices) {
                //buffer loaded currency prices
                _this.currencyPrices = allCurrencyPrices;
                //load display currency prices from secure storage
                var storedPriceInformationString = _this.secureStorage.getSync({
                    key: "cryptoCoinCalcPriceInformationData",
                });
                if (storedPriceInformationString) {
                    var storedPriceInformations = JSON.parse(storedPriceInformationString);
                    for (var i = 0; i < storedPriceInformations.length; i++) {
                        var storedPriceInformation = storedPriceInformations[i];
                        var currencyPrice = _this.getCurrencyPrice(storedPriceInformation.currencyCodeFrom, storedPriceInformation.currencyCodeTo, storedPriceInformation.platform);
                        if (!currencyPrice) {
                            //should not happen because then the server does not support this pair
                            console.log("Stored Symbol Pair does not exist in server API");
                        }
                        currencyPrice.setDescription(storedPriceInformation.currencyPriceDescription);
                    }
                }
                resolve(true);
            });
        });
    };
    CurrencyPriceService.prototype.loadCurrencyPricesFromPlatform = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var bitstampSymbols;
            var bitfinexSymbols;
            var promiseBitstamp = _this.platformService.readAllBitstampSymbols().then(function (result) {
                bitstampSymbols = result;
            });
            var promiseBitfinex = _this.platformService.readAllBitfinexSymbols().then(function (result) {
                bitfinexSymbols = result;
            });
            Promise.all([promiseBitfinex, promiseBitstamp]).then(function () {
                resolve(bitstampSymbols.concat(bitfinexSymbols));
            });
        });
    };
    CurrencyPriceService.prototype.getDistinctCurrencySymbols = function (platform) {
        var allCurrencyPrices = this.getAllCurrencyPricesIgnoringDisplaySetting(platform);
        var allSymbols = [];
        for (var i = 0; i < allCurrencyPrices.length; i++) {
            var currencyPrice = allCurrencyPrices[i];
            var symbolFromFound = false;
            var symbolToFound = false;
            for (var j = 0; j < allSymbols.length; j++) {
                if (allSymbols[j] === currencyPrice.currencyCodeFrom) {
                    symbolFromFound = true;
                }
                if (allSymbols[j] === currencyPrice.currencyCodeTo) {
                    symbolToFound = true;
                }
            }
            if (!symbolFromFound) {
                allSymbols.push(currencyPrice.currencyCodeFrom);
            }
            if (!symbolToFound) {
                allSymbols.push(currencyPrice.currencyCodeTo);
            }
        }
        return allSymbols;
    };
    CurrencyPriceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [platform_service_1.PlatformService])
    ], CurrencyPriceService);
    return CurrencyPriceService;
}());
exports.CurrencyPriceService = CurrencyPriceService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktcHJpY2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImN1cnJlbmN5LXByaWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFFekQsa0RBQWlEO0FBQ2pELDJFQUE0RDtBQUU1RCx1REFBcUQ7QUFJckQ7SUFLSSw4QkFBNkIsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBSjdELG1CQUFjLEdBQXlCLEVBQUUsQ0FBQztRQUNsQyxrQkFBYSxHQUFrQixJQUFJLDJDQUFhLEVBQUUsQ0FBQztRQUNwRCwwQkFBcUIsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztJQUVPLENBQUM7SUFFbEUsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixRQUFnQixFQUFFLE1BQWMsRUFBRSxXQUFXLEVBQUUsUUFBUTtRQUN2RSxJQUFJLGdCQUFnQixHQUFHLElBQUksNkJBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLFlBQVksRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0lBRUQsa0RBQW1CLEdBQW5CLFVBQW9CLGFBQTRCO1FBQzVDLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxD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QztZQUNwRCxDQUFDO1lBRUQsRUFBRSxDQUFBLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNsRCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQWpOUSxvQkFBb0I7UUFEaEMsaUJBQVUsRUFBRTt5Q0FNcUMsa0NBQWU7T0FMcEQsb0JBQW9CLENBbU5oQztJQUFELDJCQUFDO0NBQUEsQUFuTkQsSUFtTkM7QUFuTlksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgQ3VycmVuY3lQcmljZSB9IGZyb20gXCIuLi9DdXJyZW5jeVByaWNlXCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5pbXBvcnQgeyBQbGF0Zm9ybVNlcnZpY2UgfSBmcm9tIFwiLi9wbGF0Zm9ybS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQbGF0Zm9ybUZhY3RvcnkgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcGxhdGZvcm0tY29tbW9uXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDdXJyZW5jeVByaWNlU2VydmljZSB7XG4gICAgY3VycmVuY3lQcmljZXM6IEFycmF5PEN1cnJlbmN5UHJpY2U+ID0gW107XG4gICAgcHJpdmF0ZSBzZWN1cmVTdG9yYWdlOiBTZWN1cmVTdG9yYWdlID0gbmV3IFNlY3VyZVN0b3JhZ2UoKTtcbiAgICBwdWJsaWMgY3VycmVuY3lQcmljZXNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxPYmplY3Q+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtU2VydmljZTogUGxhdGZvcm1TZXJ2aWNlKSB7IH1cblxuICAgIGFkZEN1cnJlbmN5UHJpY2UoY3VycmVuY3lQcmljZSkge1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzLnB1c2goY3VycmVuY3lQcmljZSk7XG4gICAgfVxuXG5cbiAgICBjcmVhdGVDdXJyZW5jeVByaWNlKGNvZGVGcm9tOiBzdHJpbmcsIGNvZGVUbzogc3RyaW5nLCBkZXNjcmlwdGlvbiwgcGxhdGZvcm0pOiBDdXJyZW5jeVByaWNlIHtcbiAgICAgICAgbGV0IG5ld0N1cnJlbmN5UHJpY2UgPSBuZXcgQ3VycmVuY3lQcmljZShjb2RlRnJvbSwgY29kZVRvLCBwbGF0Zm9ybSk7XG4gICAgICAgIG5ld0N1cnJlbmN5UHJpY2Uuc2V0RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xuXG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMucHVzaChuZXdDdXJyZW5jeVByaWNlKTtcblxuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICAgIGRhdGE6IG51bGwsIFxuICAgICAgICAgICAgbWVzc2FnZTogbnVsbCwgXG4gICAgICAgICAgICBub3RpZmljYXRpb246IG51bGxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld0N1cnJlbmN5UHJpY2U7XG4gICAgfVxuXG4gICAgZGVsZXRlQ3VycmVuY3lQcmljZShjdXJyZW5jeVByaWNlOiBDdXJyZW5jeVByaWNlKSB7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q3VycmVuY3lQcmljZSA9IHRoaXMuY3VycmVuY3lQcmljZXNbaV07XG4gICAgICAgICAgICBpZihjdXJyZW50Q3VycmVuY3lQcmljZS5wbGF0Zm9ybSA9PT0gY3VycmVuY3lQcmljZS5wbGF0Zm9ybSAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRDdXJyZW5jeVByaWNlLmN1cnJlbmN5Q29kZUZyb20gPT09IGN1cnJlbmN5UHJpY2UuY3VycmVuY3lDb2RlRnJvbSAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRDdXJyZW5jeVByaWNlLmN1cnJlbmN5Q29kZVRvID09PSBjdXJyZW5jeVByaWNlLmN1cnJlbmN5Q29kZVRvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNDaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0QWxsQ3VycmVuY3lQcmljZXMocGxhdGZvcm0/OiBzdHJpbmcpOiBBcnJheTxDdXJyZW5jeVByaWNlPiB7XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcztcblxuICAgICAgICBpZiAocGxhdGZvcm0pIHtcbiAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wbGF0Zm9ybSA9PT0gcGxhdGZvcm0gJiYgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5nZXREZXNjcmlwdGlvbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzLnB1c2godGhpcy5jdXJyZW5jeVByaWNlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVuY3lQcmljZXMgPSB0aGlzLmN1cnJlbmN5UHJpY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbmN5UHJpY2VzO1xuICAgIH1cblxuXG4gICAgZ2V0QWxsQ3VycmVuY3lQcmljZXNJZ25vcmluZ0Rpc3BsYXlTZXR0aW5nKHBsYXRmb3JtPzogc3RyaW5nKTogQXJyYXk8Q3VycmVuY3lQcmljZT4ge1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZXM7XG5cbiAgICAgICAgaWYgKHBsYXRmb3JtKSB7XG4gICAgICAgICAgICBjdXJyZW5jeVByaWNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVuY3lQcmljZXNbaV0ucGxhdGZvcm0gPT09IHBsYXRmb3JtKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzLnB1c2godGhpcy5jdXJyZW5jeVByaWNlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVuY3lQcmljZXMgPSB0aGlzLmN1cnJlbmN5UHJpY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbmN5UHJpY2VzO1xuICAgIH1cblxuXG4gICAgZ2V0Q3VycmVuY3lQcmljZUFtb3VudChjb2RlRnJvbTogc3RyaW5nLCBjb2RlVG86IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlRnJvbSA9PT0gY29kZUZyb20gJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZVRvID09PSBjb2RlVG8gJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnBsYXRmb3JtID09PSBwbGF0Zm9ybSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnByaWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBnZXRDdXJyZW5jeVByaWNlKGNvZGVGcm9tOiBzdHJpbmcsIGNvZGVUbzogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ3VycmVuY3lQcmljZSB7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmKCh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZUZyb20gPT09IGNvZGVGcm9tICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVUbyA9PT0gY29kZVRvKSB8fCBcbiAgICAgICAgICAgICAgICAodGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVGcm9tID09PSBjb2RlVG8gJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZVRvID09PSBjb2RlRnJvbSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnBsYXRmb3JtID09PSBwbGF0Zm9ybSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGdldEN1cnJlbmN5UHJpY2VGb3JEaXNwbGF5KGNvZGVGcm9tLCBjb2RlVG8sIHBsYXRmb3JtKSB7XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlID0gdGhpcy5nZXRDdXJyZW5jeVByaWNlKGNvZGVGcm9tLCBjb2RlVG8sIHBsYXRmb3JtKTtcblxuICAgICAgICBpZighY3VycmVuY3lQcmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY3VycmVuY3lQcmljZS5nZXREZXNjcmlwdGlvbigpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbmN5UHJpY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc2F2ZUN1cnJlbmN5UHJpY2VzKCkge1xuICAgICAgICB0aGlzLnNlY3VyZVN0b3JhZ2Uuc2V0U3luYyh7XG4gICAgICAgICAgICBrZXk6IFwiY3J5cHRvQ29pbkNhbGNQcmljZUluZm9ybWF0aW9uRGF0YVwiLFxuICAgICAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHRoaXMuY3VycmVuY3lQcmljZXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWRDdXJyZW5jeVByaWNlcygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZEN1cnJlbmN5UHJpY2VzRnJvbVBsYXRmb3JtKCkudGhlbigoYWxsQ3VycmVuY3lQcmljZXMpID0+IHtcbiAgICAgICAgICAgICAgICAvL2J1ZmZlciBsb2FkZWQgY3VycmVuY3kgcHJpY2VzXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlcyA9IGFsbEN1cnJlbmN5UHJpY2VzO1xuXG4gICAgICAgICAgICAgICAgLy9sb2FkIGRpc3BsYXkgY3VycmVuY3kgcHJpY2VzIGZyb20gc2VjdXJlIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvblN0cmluZyA9IHRoaXMuc2VjdXJlU3RvcmFnZS5nZXRTeW5jKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUHJpY2VJbmZvcm1hdGlvbkRhdGFcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHN0b3JlZFByaWNlSW5mb3JtYXRpb25TdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zID0gSlNPTi5wYXJzZShzdG9yZWRQcmljZUluZm9ybWF0aW9uU3RyaW5nKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdG9yZWRQcmljZUluZm9ybWF0aW9uID0gc3RvcmVkUHJpY2VJbmZvcm1hdGlvbnNbaV07XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2UgPSB0aGlzLmdldEN1cnJlbmN5UHJpY2Uoc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5jdXJyZW5jeUNvZGVGcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRQcmljZUluZm9ybWF0aW9uLmN1cnJlbmN5Q29kZVRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRQcmljZUluZm9ybWF0aW9uLnBsYXRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWN1cnJlbmN5UHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Nob3VsZCBub3QgaGFwcGVuIGJlY2F1c2UgdGhlbiB0aGUgc2VydmVyIGRvZXMgbm90IHN1cHBvcnQgdGhpcyBwYWlyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdG9yZWQgU3ltYm9sIFBhaXIgZG9lcyBub3QgZXhpc3QgaW4gc2VydmVyIEFQSVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5UHJpY2Uuc2V0RGVzY3JpcHRpb24oc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5jdXJyZW5jeVByaWNlRGVzY3JpcHRpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBsb2FkQ3VycmVuY3lQcmljZXNGcm9tUGxhdGZvcm0oKTogUHJvbWlzZTxDdXJyZW5jeVByaWNlW10+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPEN1cnJlbmN5UHJpY2VbXT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdmFyIGJpdHN0YW1wU3ltYm9sczogQ3VycmVuY3lQcmljZVtdO1xuICAgICAgICAgICAgdmFyIGJpdGZpbmV4U3ltYm9sczogQ3VycmVuY3lQcmljZVtdO1xuXG4gICAgICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5wbGF0Zm9ybVNlcnZpY2UucmVhZEFsbEJpdHN0YW1wU3ltYm9scygpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGJpdHN0YW1wU3ltYm9scyA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGV0IHByb21pc2VCaXRmaW5leCA9IHRoaXMucGxhdGZvcm1TZXJ2aWNlLnJlYWRBbGxCaXRmaW5leFN5bWJvbHMoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBiaXRmaW5leFN5bWJvbHMgPSByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW3Byb21pc2VCaXRmaW5leCwgcHJvbWlzZUJpdHN0YW1wXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShiaXRzdGFtcFN5bWJvbHMuY29uY2F0KGJpdGZpbmV4U3ltYm9scykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGlzdGluY3RDdXJyZW5jeVN5bWJvbHMocGxhdGZvcm06IHN0cmluZyk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBsZXQgYWxsQ3VycmVuY3lQcmljZXMgPSB0aGlzLmdldEFsbEN1cnJlbmN5UHJpY2VzSWdub3JpbmdEaXNwbGF5U2V0dGluZyhwbGF0Zm9ybSk7XG4gICAgICAgIGxldCBhbGxTeW1ib2xzID0gW107XG5cbiAgICAgICAgZm9yKHZhciBpPTA7IGk8YWxsQ3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW5jeVByaWNlID0gYWxsQ3VycmVuY3lQcmljZXNbaV07XG4gICAgICAgICAgICBsZXQgc3ltYm9sRnJvbUZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgc3ltYm9sVG9Gb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IodmFyIGo9MDsgajxhbGxTeW1ib2xzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYoYWxsU3ltYm9sc1tqXSA9PT0gY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVGcm9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbEZyb21Gb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoYWxsU3ltYm9sc1tqXSA9PT0gY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVUbykge1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2xUb0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFzeW1ib2xGcm9tRm91bmQpIHtcbiAgICAgICAgICAgICAgICBhbGxTeW1ib2xzLnB1c2goY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVGcm9tKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIXN5bWJvbFRvRm91bmQpIHtcbiAgICAgICAgICAgICAgICBhbGxTeW1ib2xzLnB1c2goY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVUbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3ltYm9scztcbiAgICB9XG4gICAgXG59Il19