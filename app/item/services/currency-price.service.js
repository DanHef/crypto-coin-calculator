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
    CurrencyPriceService.prototype.getCurrencyPriceForDisplay = function (codeFrom, codeTo, platform) {
        var currencyPrice = this.getCurrencyPrice(codeFrom, codeTo, platform);
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
    CurrencyPriceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [platform_service_1.PlatformService])
    ], CurrencyPriceService);
    return CurrencyPriceService;
}());
exports.CurrencyPriceService = CurrencyPriceService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktcHJpY2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImN1cnJlbmN5LXByaWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFFekQsa0RBQWlEO0FBQ2pELDJFQUE0RDtBQUU1RCx1REFBcUQ7QUFJckQ7SUFLSSw4QkFBNkIsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBSjdELG1CQUFjLEdBQXlCLEVBQUUsQ0FBQztRQUNsQyxrQkFBYSxHQUFrQixJQUFJLDJDQUFhLEVBQUUsQ0FBQztRQUNwRCwwQkFBcUIsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztJQUVPLENBQUM7SUFFbEUsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixRQUFnQixFQUFFLE1BQWMsRUFBRSxXQUFXLEVBQUUsUUFBUTtRQUN2RSxJQUFJLGdCQUFnQixHQUFHLElBQUksNkJBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLFlBQVksRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0lBRUQsa0RBQW1CLEdBQW5CLFVBQW9CLGFBQTRCO1FBQzVDLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxD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SSxlQUFnQyxDQUFDO1lBRXJDLElBQUksZUFBZSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNO2dCQUM1RSxlQUFlLEdBQUcsTUFBTSxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxlQUFlLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQU07Z0JBQzVFLGVBQWUsR0FBRyxNQUFNLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNqRCxPQUFPLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBN0pRLG9CQUFvQjtRQURoQyxpQkFBVSxFQUFFO3lDQU1xQyxrQ0FBZTtPQUxwRCxvQkFBb0IsQ0E4SmhDO0lBQUQsMkJBQUM7Q0FBQSxBQTlKRCxJQThKQztBQTlKWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlIH0gZnJvbSBcIi4uL0N1cnJlbmN5UHJpY2VcIjtcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XG5cbmltcG9ydCB7IFBsYXRmb3JtU2VydmljZSB9IGZyb20gXCIuL3BsYXRmb3JtLnNlcnZpY2VcIjtcbmltcG9ydCB7IFBsYXRmb3JtRmFjdG9yeSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9wbGF0Zm9ybS1jb21tb25cIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEN1cnJlbmN5UHJpY2VTZXJ2aWNlIHtcbiAgICBjdXJyZW5jeVByaWNlczogQXJyYXk8Q3VycmVuY3lQcmljZT4gPSBbXTtcbiAgICBwcml2YXRlIHNlY3VyZVN0b3JhZ2U6IFNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuICAgIHB1YmxpYyBjdXJyZW5jeVByaWNlc0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPE9iamVjdD4oKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcGxhdGZvcm1TZXJ2aWNlOiBQbGF0Zm9ybVNlcnZpY2UpIHsgfVxuXG4gICAgYWRkQ3VycmVuY3lQcmljZShjdXJyZW5jeVByaWNlKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMucHVzaChjdXJyZW5jeVByaWNlKTtcbiAgICB9XG5cblxuICAgIGNyZWF0ZUN1cnJlbmN5UHJpY2UoY29kZUZyb206IHN0cmluZywgY29kZVRvOiBzdHJpbmcsIGRlc2NyaXB0aW9uLCBwbGF0Zm9ybSk6IEN1cnJlbmN5UHJpY2Uge1xuICAgICAgICBsZXQgbmV3Q3VycmVuY3lQcmljZSA9IG5ldyBDdXJyZW5jeVByaWNlKGNvZGVGcm9tLCBjb2RlVG8sIHBsYXRmb3JtKTtcbiAgICAgICAgbmV3Q3VycmVuY3lQcmljZS5zZXREZXNjcmlwdGlvbihkZXNjcmlwdGlvbik7XG5cbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlcy5wdXNoKG5ld0N1cnJlbmN5UHJpY2UpO1xuXG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNDaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgICAgZGF0YTogbnVsbCwgXG4gICAgICAgICAgICBtZXNzYWdlOiBudWxsLCBcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogbnVsbFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3Q3VycmVuY3lQcmljZTtcbiAgICB9XG5cbiAgICBkZWxldGVDdXJyZW5jeVByaWNlKGN1cnJlbmN5UHJpY2U6IEN1cnJlbmN5UHJpY2UpIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8dGhpcy5jdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRDdXJyZW5jeVByaWNlID0gdGhpcy5jdXJyZW5jeVByaWNlc1tpXTtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRDdXJyZW5jeVByaWNlLnBsYXRmb3JtID09PSBjdXJyZW5jeVByaWNlLnBsYXRmb3JtICYmXG4gICAgICAgICAgICAgICAgY3VycmVudEN1cnJlbmN5UHJpY2UuY3VycmVuY3lDb2RlRnJvbSA9PT0gY3VycmVuY3lQcmljZS5jdXJyZW5jeUNvZGVGcm9tICYmXG4gICAgICAgICAgICAgICAgY3VycmVudEN1cnJlbmN5UHJpY2UuY3VycmVuY3lDb2RlVG8gPT09IGN1cnJlbmN5UHJpY2UuY3VycmVuY3lDb2RlVG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlcy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG51bGwsIFxuICAgICAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBnZXRBbGxDdXJyZW5jeVByaWNlcyhwbGF0Zm9ybT86IHN0cmluZyk6IEFycmF5PEN1cnJlbmN5UHJpY2U+IHtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2VzO1xuXG4gICAgICAgIGlmIChwbGF0Zm9ybSkge1xuICAgICAgICAgICAgY3VycmVuY3lQcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnBsYXRmb3JtID09PSBwbGF0Zm9ybSAmJiB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmdldERlc2NyaXB0aW9uKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVuY3lQcmljZXMucHVzaCh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW5jeVByaWNlcyA9IHRoaXMuY3VycmVuY3lQcmljZXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VycmVuY3lQcmljZXM7XG4gICAgfVxuXG5cbiAgICBnZXRDdXJyZW5jeVByaWNlQW1vdW50KGNvZGVGcm9tOiBzdHJpbmcsIGNvZGVUbzogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVGcm9tID09PSBjb2RlRnJvbSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlVG8gPT09IGNvZGVUbyAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNbaV0ucGxhdGZvcm0gPT09IHBsYXRmb3JtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVuY3lQcmljZXNbaV0ucHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGdldEN1cnJlbmN5UHJpY2UoY29kZUZyb206IHN0cmluZywgY29kZVRvOiBzdHJpbmcsIHBsYXRmb3JtOiBzdHJpbmcpOiBDdXJyZW5jeVByaWNlIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8dGhpcy5jdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYoKHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlRnJvbSA9PT0gY29kZUZyb20gJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZVRvID09PSBjb2RlVG8pIHx8IFxuICAgICAgICAgICAgICAgICh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZUZyb20gPT09IGNvZGVUbyAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlVG8gPT09IGNvZGVGcm9tKSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNbaV0ucGxhdGZvcm0gPT09IHBsYXRmb3JtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbmN5UHJpY2VzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0Q3VycmVuY3lQcmljZUZvckRpc3BsYXkoY29kZUZyb20sIGNvZGVUbywgcGxhdGZvcm0pIHtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2UgPSB0aGlzLmdldEN1cnJlbmN5UHJpY2UoY29kZUZyb20sIGNvZGVUbywgcGxhdGZvcm0pO1xuXG4gICAgICAgIGlmKGN1cnJlbmN5UHJpY2UuZ2V0RGVzY3JpcHRpb24oKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW5jeVByaWNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHNhdmVDdXJyZW5jeVByaWNlcygpIHtcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUHJpY2VJbmZvcm1hdGlvbkRhdGFcIixcbiAgICAgICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh0aGlzLmN1cnJlbmN5UHJpY2VzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkQ3VycmVuY3lQcmljZXMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRDdXJyZW5jeVByaWNlc0Zyb21QbGF0Zm9ybSgpLnRoZW4oKGFsbEN1cnJlbmN5UHJpY2VzKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9idWZmZXIgbG9hZGVkIGN1cnJlbmN5IHByaWNlc1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMgPSBhbGxDdXJyZW5jeVByaWNlcztcblxuICAgICAgICAgICAgICAgIC8vbG9hZCBkaXNwbGF5IGN1cnJlbmN5IHByaWNlcyBmcm9tIHNlY3VyZSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlZFByaWNlSW5mb3JtYXRpb25TdHJpbmcgPSB0aGlzLnNlY3VyZVN0b3JhZ2UuZ2V0U3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1ByaWNlSW5mb3JtYXRpb25EYXRhXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzdG9yZWRQcmljZUluZm9ybWF0aW9uU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdG9yZWRQcmljZUluZm9ybWF0aW9ucyA9IEpTT04ucGFyc2Uoc3RvcmVkUHJpY2VJbmZvcm1hdGlvblN0cmluZyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbiA9IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zW2ldO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW5jeVByaWNlID0gdGhpcy5nZXRDdXJyZW5jeVByaWNlKHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lDb2RlRnJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5jdXJyZW5jeUNvZGVUbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5wbGF0Zm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFjdXJyZW5jeVByaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG91bGQgbm90IGhhcHBlbiBiZWNhdXNlIHRoZW4gdGhlIHNlcnZlciBkb2VzIG5vdCBzdXBwb3J0IHRoaXMgcGFpclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RvcmVkIFN5bWJvbCBQYWlyIGRvZXMgbm90IGV4aXN0IGluIHNlcnZlciBBUElcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlLnNldERlc2NyaXB0aW9uKHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lQcmljZURlc2NyaXB0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgbG9hZEN1cnJlbmN5UHJpY2VzRnJvbVBsYXRmb3JtKCk6IFByb21pc2U8Q3VycmVuY3lQcmljZVtdPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxDdXJyZW5jeVByaWNlW10+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHZhciBiaXRzdGFtcFN5bWJvbHM6IEN1cnJlbmN5UHJpY2VbXTtcbiAgICAgICAgICAgIHZhciBiaXRmaW5leFN5bWJvbHM6IEN1cnJlbmN5UHJpY2VbXTtcblxuICAgICAgICAgICAgbGV0IHByb21pc2VCaXRzdGFtcCA9IHRoaXMucGxhdGZvcm1TZXJ2aWNlLnJlYWRBbGxCaXRzdGFtcFN5bWJvbHMoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBiaXRzdGFtcFN5bWJvbHMgPSByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxldCBwcm9taXNlQml0ZmluZXggPSB0aGlzLnBsYXRmb3JtU2VydmljZS5yZWFkQWxsQml0ZmluZXhTeW1ib2xzKCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgYml0ZmluZXhTeW1ib2xzID0gcmVzdWx0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFByb21pc2UuYWxsKFtwcm9taXNlQml0ZmluZXgsIHByb21pc2VCaXRzdGFtcF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoYml0c3RhbXBTeW1ib2xzLmNvbmNhdChiaXRmaW5leFN5bWJvbHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxufSJdfQ==