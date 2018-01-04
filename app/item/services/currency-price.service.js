"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CurrencyPrice_1 = require("../CurrencyPrice");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var CurrencyPriceService = (function () {
    function CurrencyPriceService() {
        this.currencyPrices = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
    }
    CurrencyPriceService.prototype.addCurrencyPrice = function (currencyPrice) {
        this.currencyPrices.push(currencyPrice);
    };
    CurrencyPriceService.prototype.createCurrencyPrice = function (codeFrom, codeTo, description, platform) {
        var newCurrencyPrice = new CurrencyPrice_1.CurrencyPrice(codeFrom, codeTo, platform, description);
        this.currencyPrices.push(newCurrencyPrice);
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
        this.secureStorage.removeSync({ key: "cryptoCoinCalcPriceInformationData" });
        var storedPriceInformationString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPriceInformationData",
        });
        if (storedPriceInformationString) {
            var storedPriceInformations = JSON.parse(storedPriceInformationString);
            for (var i = 0; i < storedPriceInformations.length; i++) {
                var storedPriceInformation = storedPriceInformations[i];
                this.createCurrencyPrice(storedPriceInformation.currencyCodeFrom, storedPriceInformation.currencyCodeTo, storedPriceInformation.description, storedPriceInformation.platform);
            }
        }
    };
    CurrencyPriceService = __decorate([
        core_1.Injectable()
    ], CurrencyPriceService);
    return CurrencyPriceService;
}());
exports.CurrencyPriceService = CurrencyPriceService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktcHJpY2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImN1cnJlbmN5LXByaWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFFM0Msa0RBQWlEO0FBQ2pELDJFQUE0RDtBQUc1RDtJQURBO1FBRUksbUJBQWMsR0FBeUIsRUFBRSxDQUFDO1FBQzFDLGtCQUFhLEdBQWtCLElBQUksMkNBQWEsRUFBRSxDQUFDO0lBdUZ2RCxDQUFDO0lBcEZHLCtDQUFnQixHQUFoQixVQUFpQixhQUFhO1FBQzFCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFHRCxrREFBbUIsR0FBbkIsVUFBb0IsUUFBZ0IsRUFBRSxNQUFjLEVBQUUsV0FBVyxFQUFFLFFBQVE7UUFDdkUsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLDZCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFbEYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUUzQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDNUIsQ0FBQztJQUdELG1EQUFvQixHQUFwQixVQUFxQixRQUFpQjtRQUNsQyxJQUFJLGNBQWMsQ0FBQztRQUVuQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1gsY0FBYyxHQUFHLEVBQUUsQ0FBQztZQUNwQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2xELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQy9D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LENBQUMsQ0FBQyxDQUFDO2dCQUV4RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLEVBQzVELHNCQUFzQixDQUFDLGNBQWMsRUFDckMsc0JBQXNCLENBQUMsV0FBVyxFQUNsQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV6QyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUF4RlEsb0JBQW9CO1FBRGhDLGlCQUFVLEVBQUU7T0FDQSxvQkFBb0IsQ0F5RmhDO0lBQUQsMkJBQUM7Q0FBQSxBQXpGRCxJQXlGQztBQXpGWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgQ3VycmVuY3lQcmljZSB9IGZyb20gXCIuLi9DdXJyZW5jeVByaWNlXCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VycmVuY3lQcmljZVNlcnZpY2Uge1xuICAgIGN1cnJlbmN5UHJpY2VzOiBBcnJheTxDdXJyZW5jeVByaWNlPiA9IFtdO1xuICAgIHNlY3VyZVN0b3JhZ2U6IFNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuXG5cbiAgICBhZGRDdXJyZW5jeVByaWNlKGN1cnJlbmN5UHJpY2UpIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlcy5wdXNoKGN1cnJlbmN5UHJpY2UpO1xuICAgIH1cblxuXG4gICAgY3JlYXRlQ3VycmVuY3lQcmljZShjb2RlRnJvbTogc3RyaW5nLCBjb2RlVG86IHN0cmluZywgZGVzY3JpcHRpb24sIHBsYXRmb3JtKTogQ3VycmVuY3lQcmljZSB7XG4gICAgICAgIGxldCBuZXdDdXJyZW5jeVByaWNlID0gbmV3IEN1cnJlbmN5UHJpY2UoY29kZUZyb20sIGNvZGVUbywgcGxhdGZvcm0sIGRlc2NyaXB0aW9uKTtcblxuICAgICAgICB0aGlzLmN1cnJlbmN5UHJpY2VzLnB1c2gobmV3Q3VycmVuY3lQcmljZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld0N1cnJlbmN5UHJpY2U7XG4gICAgfVxuXG5cbiAgICBnZXRBbGxDdXJyZW5jeVByaWNlcyhwbGF0Zm9ybT86IHN0cmluZyk6IEFycmF5PEN1cnJlbmN5UHJpY2U+IHtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2VzO1xuXG4gICAgICAgIGlmIChwbGF0Zm9ybSkge1xuICAgICAgICAgICAgY3VycmVuY3lQcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJyZW5jeVByaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLnBsYXRmb3JtID09PSBwbGF0Zm9ybSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlcy5wdXNoKHRoaXMuY3VycmVuY3lQcmljZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbmN5UHJpY2VzID0gdGhpcy5jdXJyZW5jeVByaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyZW5jeVByaWNlcztcbiAgICB9XG5cblxuICAgIGdldEN1cnJlbmN5UHJpY2VBbW91bnQoY29kZUZyb206IHN0cmluZywgY29kZVRvOiBzdHJpbmcsIHBsYXRmb3JtOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVuY3lQcmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbmN5UHJpY2VzW2ldLmN1cnJlbmN5Q29kZUZyb20gPT09IGNvZGVGcm9tICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVUbyA9PT0gY29kZVRvICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wbGF0Zm9ybSA9PT0gcGxhdGZvcm0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wcmljZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZ2V0Q3VycmVuY3lQcmljZShjb2RlRnJvbTogc3RyaW5nLCBjb2RlVG86IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IEN1cnJlbmN5UHJpY2Uge1xuICAgICAgICBmb3IodmFyIGk9MDsgaTx0aGlzLmN1cnJlbmN5UHJpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZigodGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVGcm9tID09PSBjb2RlRnJvbSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlVG8gPT09IGNvZGVUbykgfHwgXG4gICAgICAgICAgICAgICAgKHRoaXMuY3VycmVuY3lQcmljZXNbaV0uY3VycmVuY3lDb2RlRnJvbSA9PT0gY29kZVRvICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5jdXJyZW5jeUNvZGVUbyA9PT0gY29kZUZyb20pICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlc1tpXS5wbGF0Zm9ybSA9PT0gcGxhdGZvcm0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVuY3lQcmljZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzYXZlQ3VycmVuY3lQcmljZXMoKSB7XG4gICAgICAgIHRoaXMuc2VjdXJlU3RvcmFnZS5zZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1ByaWNlSW5mb3JtYXRpb25EYXRhXCIsXG4gICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW5jeVByaWNlcylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZEN1cnJlbmN5UHJpY2VzKCkge1xuICAgICAgICB0aGlzLnNlY3VyZVN0b3JhZ2UucmVtb3ZlU3luYyh7a2V5OiBcImNyeXB0b0NvaW5DYWxjUHJpY2VJbmZvcm1hdGlvbkRhdGFcIn0pO1xuXG4gICAgICAgIGxldCBzdG9yZWRQcmljZUluZm9ybWF0aW9uU3RyaW5nID0gdGhpcy5zZWN1cmVTdG9yYWdlLmdldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUHJpY2VJbmZvcm1hdGlvbkRhdGFcIixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHN0b3JlZFByaWNlSW5mb3JtYXRpb25TdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBzdG9yZWRQcmljZUluZm9ybWF0aW9ucyA9IEpTT04ucGFyc2Uoc3RvcmVkUHJpY2VJbmZvcm1hdGlvblN0cmluZyk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbiA9IHN0b3JlZFByaWNlSW5mb3JtYXRpb25zW2ldO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVDdXJyZW5jeVByaWNlKHN0b3JlZFByaWNlSW5mb3JtYXRpb24uY3VycmVuY3lDb2RlRnJvbSxcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5jdXJyZW5jeUNvZGVUbyxcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkUHJpY2VJbmZvcm1hdGlvbi5wbGF0Zm9ybSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iXX0=