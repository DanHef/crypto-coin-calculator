"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CurrencyPrice_1 = require("../CurrencyPrice");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var CurrencyPriceService = (function () {
    function CurrencyPriceService() {
        this.currencyPrices = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
        this.currencyPricesChanged = new core_1.EventEmitter();
    }
    CurrencyPriceService.prototype.addCurrencyPrice = function (currencyPrice) {
        this.currencyPrices.push(currencyPrice);
    };
    CurrencyPriceService.prototype.createCurrencyPrice = function (codeFrom, codeTo, description, platform) {
        var newCurrencyPrice = new CurrencyPrice_1.CurrencyPrice(codeFrom, codeTo, platform, description);
        this.currencyPrices.push(newCurrencyPrice);
        this.currencyPricesChanged.emit({
            data: null,
            message: null,
            notification: null
        });
        return newCurrencyPrice;
    };
    CurrencyPriceService.prototype.getAllCurrencyPrices = function (platform) {
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
    CurrencyPriceService.prototype.saveCurrencyPrices = function () {
        this.secureStorage.setSync({
            key: "cryptoCoinCalcPriceInformationData",
            value: JSON.stringify(this.currencyPrices)
        });
    };
    CurrencyPriceService.prototype.loadCurrencyPrices = function () {
        var storedPriceInformationString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPriceInformationData",
        });
        if (storedPriceInformationString) {
            var storedPriceInformations = JSON.parse(storedPriceInformationString);
            for (var i = 0; i < storedPriceInformations.length; i++) {
                var storedPriceInformation = storedPriceInformations[i];
                this.createCurrencyPrice(storedPriceInformation.currencyCodeFrom, storedPriceInformation.currencyCodeTo, storedPriceInformation.currencyPriceDescription, storedPriceInformation.platform);
            }
        }
    };
    CurrencyPriceService = __decorate([
        core_1.Injectable()
    ], CurrencyPriceService);
    return CurrencyPriceService;
}());
exports.CurrencyPriceService = CurrencyPriceService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktcHJpY2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImN1cnJlbmN5LXByaWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFFekQsa0RBQWlEO0FBQ2pELDJFQUE0RDtBQUc1RDtJQURBO1FBRUksbUJBQWMsR0FBeUIsRUFBRSxDQUFDO1FBQzFDLGtCQUFhLEdBQWtCLElBQUksMkNBQWEsRUFBRSxDQUFDO1FBQzVDLDBCQUFxQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO0lBMEY5RCxDQUFDO0lBeEZHLCtDQUFnQixHQUFoQixVQUFpQixhQUFhO1FBQzFCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFHRCxrREFBbUIsR0FBbkIsVUFBb0IsUUFBZ0IsRUFBRSxNQUFjLEVBQUUsV0FBVyxFQUFFLFFBQVE7UUFDdkUsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLDZCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFbEYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDO1lBQzVCLElBQUksRUFBRSxJQUFJO1lBQ1YsT0FBTyxFQUFFLElBQUk7WUFDYixZQUFZLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDNUIsQ0FBQztJQUdELG1EQUFvQixHQUFwQixVQUFxQixRQUFpQjtRQUNsQyxJQUFJLGNBQWMsQ0FBQztRQUVuQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1gsY0FBYyxHQUFHLEVBQUUsQ0FBQztZQUNwQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUs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QUcsdUJBQXVCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3RELElBQUksc0JBQXNCLEdBQUcsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXhELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsRUFDNUQsc0JBQXNCLENBQUMsY0FBYyxFQUNyQyxzQkFBc0IsQ0FBQyx3QkFBd0IsRUFDL0Msc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFekMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBNUZRLG9CQUFvQjtRQURoQyxpQkFBVSxFQUFFO09BQ0Esb0JBQW9CLENBNkZoQztJQUFELDJCQUFDO0NBQUEsQUE3RkQsSUE2RkM7QUE3Rlksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgQ3VycmVuY3lQcmljZSB9IGZyb20gXCIuLi9DdXJyZW5jeVByaWNlXCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VycmVuY3lQcmljZVNlcnZpY2Uge1xuICAgIGN1cnJlbmN5UHJpY2VzOiBBcnJheTxDdXJyZW5jeVByaWNlPiA9IFtdO1xuICAgIHNlY3VyZVN0b3JhZ2U6IFNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuICAgIHB1YmxpYyBjdXJyZW5jeVByaWNlc0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPE9iamVjdD4oKTtcblxuICAgIGFkZEN1cnJlbmN5UHJpY2UoY3VycmVuY3lQcmljZSkge1xuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzLnB1c2goY3VycmVuY3lQcmljZSk7XG4gICAgfVxuXG5cbiAgICBjcmVhdGVDdXJyZW5jeVByaWNlKGNvZGVGcm9tOiBzdHJpbmcsIGNvZGVUbzogc3RyaW5nLCBkZXNjcmlwdGlvbiwgcGxhdGZvcm0pOiBDdXJyZW5jeVByaWNlIHtcbiAgICAgICAgbGV0IG5ld0N1cnJlbmN5UHJpY2UgPSBuZXcgQ3VycmVuY3lQcmljZShjb2RlRnJvbSwgY29kZVRvLCBwbGF0Zm9ybSwgZGVzY3JpcHRpb24pO1xuXG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXMucHVzaChuZXdDdXJyZW5jeVByaWNlKTtcblxuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICAgIGRhdGE6IG51bGwsIFxuICAgICAgICAgICAgbWVzc2FnZTogbnVsbCwgXG4gICAgICAgICAgICBub3RpZmljYXRpb246IG51bGxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld0N1cnJlbmN5UHJpY2U7XG4gICAgfVxuXG5cbiAgICBnZXRBbGxDdXJyZW5jeVByaWNlcyhwbGF0Zm9ybT86IHN0cmluZyk6IEFycmF5PEN1cnJlbmN5UHJpY2U+IHtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2VzO1xuXG4gICAgICAgIGlmIChwbGF0Zm9ybSkge1xuICAgICAgICAgICAgY3VycmVuY3lQcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnBsYXRmb3JtID09PSBwbGF0Zm9ybSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlcy5wdXNoKHRoaXMuY3VycmVuY3lQcmljZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzID0gdGhpcy5jdXJyZW5jeVByaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW5jeVByaWNlcztcbiAgICB9XG5cblxuICAgIGdldEN1cnJlbmN5UHJpY2VBbW91bnQoY29kZUZyb206IHN0cmluZywgY29kZVRvOiBzdHJpbmcsIHBsYXRmb3JtOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZUZyb20gPT09IGNvZGVGcm9tICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVUbyA9PT0gY29kZVRvICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wbGF0Zm9ybSA9PT0gcGxhdGZvcm0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wcmljZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0Q3VycmVuY3lQcmljZShjb2RlRnJvbTogc3RyaW5nLCBjb2RlVG86IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IEN1cnJlbmN5UHJpY2Uge1xuICAgICAgICBmb3IodmFyIGk9MDsgaTx0aGlzLmN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZigodGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVGcm9tID09PSBjb2RlRnJvbSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlVG8gPT09IGNvZGVUbykgfHwgXG4gICAgICAgICAgICAgICAgKHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlRnJvbSA9PT0gY29kZVRvICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVUbyA9PT0gY29kZUZyb20pICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wbGF0Zm9ybSA9PT0gcGxhdGZvcm0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVuY3lQcmljZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzYXZlQ3VycmVuY3lQcmljZXMoKSB7XG4gICAgICAgIHRoaXMuc2VjdXJlU3RvcmFnZS5zZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1ByaWNlSW5mb3JtYXRpb25EYXRhXCIsXG4gICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW5jeVByaWNlcylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZEN1cnJlbmN5UHJpY2VzKCkge1xuICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvblN0cmluZyA9IHRoaXMuc2VjdXJlU3RvcmFnZS5nZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1ByaWNlSW5mb3JtYXRpb25EYXRhXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdG9yZWRQcmljZUluZm9ybWF0aW9uU3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbnMgPSBKU09OLnBhcnNlKHN0b3JlZFByaWNlSW5mb3JtYXRpb25TdHJpbmcpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlZFByaWNlSW5mb3JtYXRpb24gPSBzdG9yZWRQcmljZUluZm9ybWF0aW9uc1tpXTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ3VycmVuY3lQcmljZShzdG9yZWRQcmljZUluZm9ybWF0aW9uLmN1cnJlbmN5Q29kZUZyb20sXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lDb2RlVG8sXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lQcmljZURlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZWRQcmljZUluZm9ybWF0aW9uLnBsYXRmb3JtKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==