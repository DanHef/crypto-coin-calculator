"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CurrencyPrice_1 = require("../CurrencyPrice");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var platform_service_1 = require("./platform.service");
var CurrencyPriceService = /** @class */ (function () {
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
                console.log("Currency Price Information:" + storedPriceInformationString);
                if (storedPriceInformationString) {
                    var storedPriceInformations = JSON.parse(storedPriceInformationString);
                    for (var i = 0; i < storedPriceInformations.length; i++) {
                        var storedPriceInformation = storedPriceInformations[i];
                        var currencyPrice = _this.getCurrencyPrice(storedPriceInformation.currencyCodeFrom, storedPriceInformation.currencyCodeTo, storedPriceInformation.platform);
                        if (!currencyPrice) {
                            //should not happen because then the server does not support this pair
                            console.log("Stored Symbol Pair does not exist in server API");
                            console.log("Currency Code From: " + storedPriceInformation.currencyCodeFrom);
                            console.log("Currency Code To: " + storedPriceInformation.currencyCodeTo);
                            console.log("Platform: " + storedPriceInformation.platform);
                        }
                        else {
                            currencyPrice.setDescription(storedPriceInformation.currencyPriceDescription);
                        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktcHJpY2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImN1cnJlbmN5LXByaWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFFekQsa0RBQWlEO0FBQ2pELDJFQUE0RDtBQUU1RCx1REFBcUQ7QUFJckQ7SUFLSSw4QkFBNkIsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBSjdELG1CQUFjLEdBQXlCLEVBQUUsQ0FBQztRQUNsQyxrQkFBYSxHQUFrQixJQUFJLDJDQUFhLEVBQUUsQ0FBQztRQUNwRCwwQkFBcUIsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztJQUVPLENBQUM7SUFFbEUsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixRQUFnQixFQUFFLE1BQWMsRUFBRSxXQUFXLEVBQUUsUUFBUTtRQUN2RSxJQUFJLGdCQUFnQixHQUFHLElBQUksNkJBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLFlBQVksRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE9BQU8sZ0JBQWdCLENBQUM7SUFDNUIsQ0FBQztJQUVELGtEQUFtQixHQUFuQixVQUFvQixhQUE0QjtRQUM1QyxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxD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QUcsRUFBRSxDQUFDO1FBRXBCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxhQUFhLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDO1lBQzVCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztZQUUxQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkMsSUFBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssYUFBYSxDQUFDLGdCQUFnQixFQUFFO29CQUNqRCxlQUFlLEdBQUcsSUFBSSxDQUFDO2lCQUMxQjtnQkFFRCxJQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxhQUFhLENBQUMsY0FBYyxFQUFFO29CQUMvQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2lCQUN4QjthQUNKO1lBRUQsSUFBRyxDQUFDLGVBQWUsRUFBRTtnQkFDakIsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzthQUNuRDtZQUVELElBQUcsQ0FBQyxhQUFhLEVBQUU7Z0JBQ2YsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDakQ7U0FDSjtRQUVELE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUF0TlEsb0JBQW9CO1FBRGhDLGlCQUFVLEVBQUU7eUNBTXFDLGtDQUFlO09BTHBELG9CQUFvQixDQXdOaEM7SUFBRCwyQkFBQztDQUFBLEFBeE5ELElBd05DO0FBeE5ZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEV2ZW50RW1pdHRlciB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbmltcG9ydCB7IEN1cnJlbmN5UHJpY2UgfSBmcm9tIFwiLi4vQ3VycmVuY3lQcmljZVwiO1xuaW1wb3J0IHsgU2VjdXJlU3RvcmFnZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc2VjdXJlLXN0b3JhZ2VcIjtcblxuaW1wb3J0IHsgUGxhdGZvcm1TZXJ2aWNlIH0gZnJvbSBcIi4vcGxhdGZvcm0uc2VydmljZVwiO1xuaW1wb3J0IHsgUGxhdGZvcm1GYWN0b3J5IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3BsYXRmb3JtLWNvbW1vblwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VycmVuY3lQcmljZVNlcnZpY2Uge1xuICAgIGN1cnJlbmN5UHJpY2VzOiBBcnJheTxDdXJyZW5jeVByaWNlPiA9IFtdO1xuICAgIHByaXZhdGUgc2VjdXJlU3RvcmFnZTogU2VjdXJlU3RvcmFnZSA9IG5ldyBTZWN1cmVTdG9yYWdlKCk7XG4gICAgcHVibGljIGN1cnJlbmN5UHJpY2VzQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8T2JqZWN0PigpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwbGF0Zm9ybVNlcnZpY2U6IFBsYXRmb3JtU2VydmljZSkgeyB9XG5cbiAgICBhZGRDdXJyZW5jeVByaWNlKGN1cnJlbmN5UHJpY2UpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlcy5wdXNoKGN1cnJlbmN5UHJpY2UpO1xuICAgIH1cblxuXG4gICAgY3JlYXRlQ3VycmVuY3lQcmljZShjb2RlRnJvbTogc3RyaW5nLCBjb2RlVG86IHN0cmluZywgZGVzY3JpcHRpb24sIHBsYXRmb3JtKTogQ3VycmVuY3lQcmljZSB7XG4gICAgICAgIGxldCBuZXdDdXJyZW5jeVByaWNlID0gbmV3IEN1cnJlbmN5UHJpY2UoY29kZUZyb20sIGNvZGVUbywgcGxhdGZvcm0pO1xuICAgICAgICBuZXdDdXJyZW5jeVByaWNlLnNldERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcblxuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzLnB1c2gobmV3Q3VycmVuY3lQcmljZSk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgICBkYXRhOiBudWxsLCBcbiAgICAgICAgICAgIG1lc3NhZ2U6IG51bGwsIFxuICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBudWxsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXdDdXJyZW5jeVByaWNlO1xuICAgIH1cblxuICAgIGRlbGV0ZUN1cnJlbmN5UHJpY2UoY3VycmVuY3lQcmljZTogQ3VycmVuY3lQcmljZSkge1xuICAgICAgICBmb3IodmFyIGk9MDsgaTx0aGlzLmN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudEN1cnJlbmN5UHJpY2UgPSB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldO1xuICAgICAgICAgICAgaWYoY3VycmVudEN1cnJlbmN5UHJpY2UucGxhdGZvcm0gPT09IGN1cnJlbmN5UHJpY2UucGxhdGZvcm0gJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50Q3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVGcm9tID09PSBjdXJyZW5jeVByaWNlLmN1cnJlbmN5Q29kZUZyb20gJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50Q3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVUbyA9PT0gY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVUbykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGdldEFsbEN1cnJlbmN5UHJpY2VzKHBsYXRmb3JtPzogc3RyaW5nKTogQXJyYXk8Q3VycmVuY3lQcmljZT4ge1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZXM7XG5cbiAgICAgICAgaWYgKHBsYXRmb3JtKSB7XG4gICAgICAgICAgICBjdXJyZW5jeVByaWNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVuY3lQcmljZXNbaV0ucGxhdGZvcm0gPT09IHBsYXRmb3JtICYmIHRoaXMuY3VycmVuY3lQcmljZXNbaV0uZ2V0RGVzY3JpcHRpb24oKSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlcy5wdXNoKHRoaXMuY3VycmVuY3lQcmljZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzID0gdGhpcy5jdXJyZW5jeVByaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW5jeVByaWNlcztcbiAgICB9XG5cblxuICAgIGdldEFsbEN1cnJlbmN5UHJpY2VzSWdub3JpbmdEaXNwbGF5U2V0dGluZyhwbGF0Zm9ybT86IHN0cmluZyk6IEFycmF5PEN1cnJlbmN5UHJpY2U+IHtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2VzO1xuXG4gICAgICAgIGlmIChwbGF0Zm9ybSkge1xuICAgICAgICAgICAgY3VycmVuY3lQcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnBsYXRmb3JtID09PSBwbGF0Zm9ybSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlcy5wdXNoKHRoaXMuY3VycmVuY3lQcmljZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzID0gdGhpcy5jdXJyZW5jeVByaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW5jeVByaWNlcztcbiAgICB9XG5cblxuICAgIGdldEN1cnJlbmN5UHJpY2VBbW91bnQoY29kZUZyb206IHN0cmluZywgY29kZVRvOiBzdHJpbmcsIHBsYXRmb3JtOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZUZyb20gPT09IGNvZGVGcm9tICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVUbyA9PT0gY29kZVRvICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wbGF0Zm9ybSA9PT0gcGxhdGZvcm0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wcmljZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0Q3VycmVuY3lQcmljZShjb2RlRnJvbTogc3RyaW5nLCBjb2RlVG86IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IEN1cnJlbmN5UHJpY2Uge1xuICAgICAgICBmb3IodmFyIGk9MDsgaTx0aGlzLmN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZigodGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVGcm9tID09PSBjb2RlRnJvbSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlVG8gPT09IGNvZGVUbykgfHwgXG4gICAgICAgICAgICAgICAgKHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlRnJvbSA9PT0gY29kZVRvICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVUbyA9PT0gY29kZUZyb20pICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wbGF0Zm9ybSA9PT0gcGxhdGZvcm0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVuY3lQcmljZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBnZXRDdXJyZW5jeVByaWNlRm9yRGlzcGxheShjb2RlRnJvbSwgY29kZVRvLCBwbGF0Zm9ybSkge1xuICAgICAgICBsZXQgY3VycmVuY3lQcmljZSA9IHRoaXMuZ2V0Q3VycmVuY3lQcmljZShjb2RlRnJvbSwgY29kZVRvLCBwbGF0Zm9ybSk7XG5cbiAgICAgICAgaWYoIWN1cnJlbmN5UHJpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmKGN1cnJlbmN5UHJpY2UuZ2V0RGVzY3JpcHRpb24oKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW5jeVByaWNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHNhdmVDdXJyZW5jeVByaWNlcygpIHtcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUHJpY2VJbmZvcm1hdGlvbkRhdGFcIixcbiAgICAgICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh0aGlzLmN1cnJlbmN5UHJpY2VzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkQ3VycmVuY3lQcmljZXMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRDdXJyZW5jeVByaWNlc0Zyb21QbGF0Zm9ybSgpLnRoZW4oKGFsbEN1cnJlbmN5UHJpY2VzKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9idWZmZXIgbG9hZGVkIGN1cnJlbmN5IHByaWNlc1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMgPSBhbGxDdXJyZW5jeVByaWNlcztcblxuICAgICAgICAgICAgICAgIC8vbG9hZCBkaXNwbGF5IGN1cnJlbmN5IHByaWNlcyBmcm9tIHNlY3VyZSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlZFByaWNlSW5mb3JtYXRpb25TdHJpbmcgPSB0aGlzLnNlY3VyZVN0b3JhZ2UuZ2V0U3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1ByaWNlSW5mb3JtYXRpb25EYXRhXCIsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkN1cnJlbmN5IFByaWNlIEluZm9ybWF0aW9uOlwiICsgc3RvcmVkUHJpY2VJbmZvcm1hdGlvblN0cmluZyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzdG9yZWRQcmljZUluZm9ybWF0aW9uU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdG9yZWRQcmljZUluZm9ybWF0aW9ucyA9IEpTT04ucGFyc2Uoc3RvcmVkUHJpY2VJbmZvcm1hdGlvblN0cmluZyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbiA9IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zW2ldO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW5jeVByaWNlID0gdGhpcy5nZXRDdXJyZW5jeVByaWNlKHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lDb2RlRnJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5jdXJyZW5jeUNvZGVUbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5wbGF0Zm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFjdXJyZW5jeVByaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG91bGQgbm90IGhhcHBlbiBiZWNhdXNlIHRoZW4gdGhlIHNlcnZlciBkb2VzIG5vdCBzdXBwb3J0IHRoaXMgcGFpclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RvcmVkIFN5bWJvbCBQYWlyIGRvZXMgbm90IGV4aXN0IGluIHNlcnZlciBBUElcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDdXJyZW5jeSBDb2RlIEZyb206IFwiICsgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5jdXJyZW5jeUNvZGVGcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkN1cnJlbmN5IENvZGUgVG86IFwiICsgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5jdXJyZW5jeUNvZGVUbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQbGF0Zm9ybTogXCIgKyBzdG9yZWRQcmljZUluZm9ybWF0aW9uLnBsYXRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVuY3lQcmljZS5zZXREZXNjcmlwdGlvbihzdG9yZWRQcmljZUluZm9ybWF0aW9uLmN1cnJlbmN5UHJpY2VEZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBsb2FkQ3VycmVuY3lQcmljZXNGcm9tUGxhdGZvcm0oKTogUHJvbWlzZTxDdXJyZW5jeVByaWNlW10+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPEN1cnJlbmN5UHJpY2VbXT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdmFyIGJpdHN0YW1wU3ltYm9sczogQ3VycmVuY3lQcmljZVtdO1xuICAgICAgICAgICAgdmFyIGJpdGZpbmV4U3ltYm9sczogQ3VycmVuY3lQcmljZVtdO1xuXG4gICAgICAgICAgICBsZXQgcHJvbWlzZUJpdHN0YW1wID0gdGhpcy5wbGF0Zm9ybVNlcnZpY2UucmVhZEFsbEJpdHN0YW1wU3ltYm9scygpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGJpdHN0YW1wU3ltYm9scyA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGV0IHByb21pc2VCaXRmaW5leCA9IHRoaXMucGxhdGZvcm1TZXJ2aWNlLnJlYWRBbGxCaXRmaW5leFN5bWJvbHMoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBiaXRmaW5leFN5bWJvbHMgPSByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW3Byb21pc2VCaXRmaW5leCwgcHJvbWlzZUJpdHN0YW1wXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShiaXRzdGFtcFN5bWJvbHMuY29uY2F0KGJpdGZpbmV4U3ltYm9scykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGlzdGluY3RDdXJyZW5jeVN5bWJvbHMocGxhdGZvcm06IHN0cmluZyk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBsZXQgYWxsQ3VycmVuY3lQcmljZXMgPSB0aGlzLmdldEFsbEN1cnJlbmN5UHJpY2VzSWdub3JpbmdEaXNwbGF5U2V0dGluZyhwbGF0Zm9ybSk7XG4gICAgICAgIGxldCBhbGxTeW1ib2xzID0gW107XG5cbiAgICAgICAgZm9yKHZhciBpPTA7IGk8YWxsQ3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW5jeVByaWNlID0gYWxsQ3VycmVuY3lQcmljZXNbaV07XG4gICAgICAgICAgICBsZXQgc3ltYm9sRnJvbUZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgc3ltYm9sVG9Gb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IodmFyIGo9MDsgajxhbGxTeW1ib2xzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYoYWxsU3ltYm9sc1tqXSA9PT0gY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVGcm9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbEZyb21Gb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoYWxsU3ltYm9sc1tqXSA9PT0gY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVUbykge1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2xUb0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFzeW1ib2xGcm9tRm91bmQpIHtcbiAgICAgICAgICAgICAgICBhbGxTeW1ib2xzLnB1c2goY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVGcm9tKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIXN5bWJvbFRvRm91bmQpIHtcbiAgICAgICAgICAgICAgICBhbGxTeW1ib2xzLnB1c2goY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVUbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsU3ltYm9scztcbiAgICB9XG4gICAgXG59Il19