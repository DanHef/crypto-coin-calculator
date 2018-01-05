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
    CurrencyPriceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [platform_service_1.PlatformService])
    ], CurrencyPriceService);
    return CurrencyPriceService;
}());
exports.CurrencyPriceService = CurrencyPriceService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktcHJpY2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImN1cnJlbmN5LXByaWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFFekQsa0RBQWlEO0FBQ2pELDJFQUE0RDtBQUU1RCx1REFBcUQ7QUFJckQ7SUFLSSw4QkFBNkIsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBSjdELG1CQUFjLEdBQXlCLEVBQUUsQ0FBQztRQUNsQyxrQkFBYSxHQUFrQixJQUFJLDJDQUFhLEVBQUUsQ0FBQztRQUNwRCwwQkFBcUIsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztJQUVPLENBQUM7SUFFbEUsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixRQUFnQixFQUFFLE1BQWMsRUFBRSxXQUFXLEVBQUUsUUFBUTtRQUN2RSxJQUFJLGdCQUFnQixHQUFHLElBQUksNkJBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLFlBQVksRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0lBRUQsa0RBQW1CLEdBQW5CLFVBQW9CLGFBQTRCO1FBQzVDLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxD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QWUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDakQsT0FBTyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQWxKUSxvQkFBb0I7UUFEaEMsaUJBQVUsRUFBRTt5Q0FNcUMsa0NBQWU7T0FMcEQsb0JBQW9CLENBbUpoQztJQUFELDJCQUFDO0NBQUEsQUFuSkQsSUFtSkM7QUFuSlksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgQ3VycmVuY3lQcmljZSB9IGZyb20gXCIuLi9DdXJyZW5jeVByaWNlXCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5pbXBvcnQgeyBQbGF0Zm9ybVNlcnZpY2UgfSBmcm9tIFwiLi9wbGF0Zm9ybS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQbGF0Zm9ybUZhY3RvcnkgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcGxhdGZvcm0tY29tbW9uXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDdXJyZW5jeVByaWNlU2VydmljZSB7XG4gICAgY3VycmVuY3lQcmljZXM6IEFycmF5PEN1cnJlbmN5UHJpY2U+ID0gW107XG4gICAgcHJpdmF0ZSBzZWN1cmVTdG9yYWdlOiBTZWN1cmVTdG9yYWdlID0gbmV3IFNlY3VyZVN0b3JhZ2UoKTtcbiAgICBwdWJsaWMgY3VycmVuY3lQcmljZXNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxPYmplY3Q+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtU2VydmljZTogUGxhdGZvcm1TZXJ2aWNlKSB7IH1cblxuICAgIGFkZEN1cnJlbmN5UHJpY2UoY3VycmVuY3lQcmljZSkge1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzLnB1c2goY3VycmVuY3lQcmljZSk7XG4gICAgfVxuXG5cbiAgICBjcmVhdGVDdXJyZW5jeVByaWNlKGNvZGVGcm9tOiBzdHJpbmcsIGNvZGVUbzogc3RyaW5nLCBkZXNjcmlwdGlvbiwgcGxhdGZvcm0pOiBDdXJyZW5jeVByaWNlIHtcbiAgICAgICAgbGV0IG5ld0N1cnJlbmN5UHJpY2UgPSBuZXcgQ3VycmVuY3lQcmljZShjb2RlRnJvbSwgY29kZVRvLCBwbGF0Zm9ybSk7XG4gICAgICAgIG5ld0N1cnJlbmN5UHJpY2Uuc2V0RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xuXG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMucHVzaChuZXdDdXJyZW5jeVByaWNlKTtcblxuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICAgIGRhdGE6IG51bGwsIFxuICAgICAgICAgICAgbWVzc2FnZTogbnVsbCwgXG4gICAgICAgICAgICBub3RpZmljYXRpb246IG51bGxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld0N1cnJlbmN5UHJpY2U7XG4gICAgfVxuXG4gICAgZGVsZXRlQ3VycmVuY3lQcmljZShjdXJyZW5jeVByaWNlOiBDdXJyZW5jeVByaWNlKSB7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50Q3VycmVuY3lQcmljZSA9IHRoaXMuY3VycmVuY3lQcmljZXNbaV07XG4gICAgICAgICAgICBpZihjdXJyZW50Q3VycmVuY3lQcmljZS5wbGF0Zm9ybSA9PT0gY3VycmVuY3lQcmljZS5wbGF0Zm9ybSAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRDdXJyZW5jeVByaWNlLmN1cnJlbmN5Q29kZUZyb20gPT09IGN1cnJlbmN5UHJpY2UuY3VycmVuY3lDb2RlRnJvbSAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRDdXJyZW5jeVByaWNlLmN1cnJlbmN5Q29kZVRvID09PSBjdXJyZW5jeVByaWNlLmN1cnJlbmN5Q29kZVRvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNDaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0QWxsQ3VycmVuY3lQcmljZXMocGxhdGZvcm0/OiBzdHJpbmcpOiBBcnJheTxDdXJyZW5jeVByaWNlPiB7XG4gICAgICAgIGxldCBjdXJyZW5jeVByaWNlcztcblxuICAgICAgICBpZiAocGxhdGZvcm0pIHtcbiAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wbGF0Zm9ybSA9PT0gcGxhdGZvcm0gJiYgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5nZXREZXNjcmlwdGlvbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzLnB1c2godGhpcy5jdXJyZW5jeVByaWNlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVuY3lQcmljZXMgPSB0aGlzLmN1cnJlbmN5UHJpY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbmN5UHJpY2VzO1xuICAgIH1cblxuXG4gICAgZ2V0Q3VycmVuY3lQcmljZUFtb3VudChjb2RlRnJvbTogc3RyaW5nLCBjb2RlVG86IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlRnJvbSA9PT0gY29kZUZyb20gJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZVRvID09PSBjb2RlVG8gJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnBsYXRmb3JtID09PSBwbGF0Zm9ybSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnByaWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBnZXRDdXJyZW5jeVByaWNlKGNvZGVGcm9tOiBzdHJpbmcsIGNvZGVUbzogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ3VycmVuY3lQcmljZSB7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmKCh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZUZyb20gPT09IGNvZGVGcm9tICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVUbyA9PT0gY29kZVRvKSB8fCBcbiAgICAgICAgICAgICAgICAodGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVGcm9tID09PSBjb2RlVG8gJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZVRvID09PSBjb2RlRnJvbSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnBsYXRmb3JtID09PSBwbGF0Zm9ybSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHNhdmVDdXJyZW5jeVByaWNlcygpIHtcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUHJpY2VJbmZvcm1hdGlvbkRhdGFcIixcbiAgICAgICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh0aGlzLmN1cnJlbmN5UHJpY2VzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkQ3VycmVuY3lQcmljZXMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRDdXJyZW5jeVByaWNlc0Zyb21QbGF0Zm9ybSgpLnRoZW4oKGFsbEN1cnJlbmN5UHJpY2VzKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9idWZmZXIgbG9hZGVkIGN1cnJlbmN5IHByaWNlc1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMgPSBhbGxDdXJyZW5jeVByaWNlcztcblxuICAgICAgICAgICAgICAgIC8vbG9hZCBkaXNwbGF5IGN1cnJlbmN5IHByaWNlcyBmcm9tIHNlY3VyZSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlZFByaWNlSW5mb3JtYXRpb25TdHJpbmcgPSB0aGlzLnNlY3VyZVN0b3JhZ2UuZ2V0U3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1ByaWNlSW5mb3JtYXRpb25EYXRhXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzdG9yZWRQcmljZUluZm9ybWF0aW9uU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdG9yZWRQcmljZUluZm9ybWF0aW9ucyA9IEpTT04ucGFyc2Uoc3RvcmVkUHJpY2VJbmZvcm1hdGlvblN0cmluZyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbiA9IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zW2ldO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW5jeVByaWNlID0gdGhpcy5nZXRDdXJyZW5jeVByaWNlKHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lDb2RlRnJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5jdXJyZW5jeUNvZGVUbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5wbGF0Zm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFjdXJyZW5jeVByaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG91bGQgbm90IGhhcHBlbiBiZWNhdXNlIHRoZW4gdGhlIHNlcnZlciBkb2VzIG5vdCBzdXBwb3J0IHRoaXMgcGFpclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RvcmVkIFN5bWJvbCBQYWlyIGRvZXMgbm90IGV4aXN0IGluIHNlcnZlciBBUElcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlLnNldERlc2NyaXB0aW9uKHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lQcmljZURlc2NyaXB0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgbG9hZEN1cnJlbmN5UHJpY2VzRnJvbVBsYXRmb3JtKCk6IFByb21pc2U8Q3VycmVuY3lQcmljZVtdPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxDdXJyZW5jeVByaWNlW10+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHZhciBiaXRzdGFtcFN5bWJvbHM6IEN1cnJlbmN5UHJpY2VbXTtcbiAgICAgICAgICAgIHZhciBiaXRmaW5leFN5bWJvbHM6IEN1cnJlbmN5UHJpY2VbXTtcblxuICAgICAgICAgICAgbGV0IHByb21pc2VCaXRzdGFtcCA9IHRoaXMucGxhdGZvcm1TZXJ2aWNlLnJlYWRBbGxCaXRzdGFtcFN5bWJvbHMoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBiaXRzdGFtcFN5bWJvbHMgPSByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxldCBwcm9taXNlQml0ZmluZXggPSB0aGlzLnBsYXRmb3JtU2VydmljZS5yZWFkQWxsQml0ZmluZXhTeW1ib2xzKCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgYml0ZmluZXhTeW1ib2xzID0gcmVzdWx0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoYml0c3RhbXBTeW1ib2xzLmNvbmNhdChiaXRmaW5leFN5bWJvbHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxufSJdfQ==