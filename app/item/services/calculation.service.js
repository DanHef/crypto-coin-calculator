"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CalculationResult_1 = require("../CalculationResult");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var portfolio_item_service_1 = require("./portfolio-item.service");
var currency_price_service_1 = require("./currency-price.service");
var CalculationService = (function () {
    function CalculationService(portfolioItemService, currencyPriceService) {
        this.portfolioItemService = portfolioItemService;
        this.currencyPriceService = currencyPriceService;
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
    CalculationService.prototype.calculateAllResults = function () {
        for (var i = 0; i < this.calculationResults.length; i++) {
            this.calculateResult(this.calculationResults[i]);
        }
    };
    CalculationService.prototype.calculateResult = function (calculationResult) {
        calculationResult.getResult();
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
            currency_price_service_1.CurrencyPriceService])
    ], CalculationService);
    return CalculationService;
}());
exports.CalculationService = CalculationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhbGN1bGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFFM0MsMERBQXlEO0FBQ3pELDJFQUE0RDtBQUU1RCxtRUFBZ0U7QUFDaEUsbUVBQWdFO0FBSWhFO0lBSUksNEJBQTZCLG9CQUEwQyxFQUMxQyxvQkFBMEM7UUFEMUMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBSi9ELHVCQUFrQixHQUE2QixFQUFFLENBQUM7UUFDbEQsa0JBQWEsR0FBa0IsSUFBSSwyQ0FBYSxFQUFFLENBQUM7SUFHZ0IsQ0FBQztJQUU1RSxpREFBb0IsR0FBcEIsVUFBcUIsaUJBQWlCO1FBQ2xDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBR0Qsb0RBQXVCLEdBQXZCLFVBQXdCLHVCQUErQixFQUFFLG9CQUE0QixFQUM3RCxXQUFtQixFQUFFLFFBQWdCO1FBQ3pELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQywrQkFBK0IsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqSCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxFQUFFLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTFILElBQUksb0JBQW9CLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUU1SCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQ2hDLENBQUM7SUFHRCxnREFBbUIsR0FBbkI7UUFDSSxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNqRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDTCxDQUFDO0lBRUQsNENBQWUsR0FBZixVQUFnQixpQkFBb0M7UUFDaEQsaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELHFEQUF3QixHQUF4QjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDbkMsQ0FBQztJQUVELHdDQUF3QztJQUV4QyxtREFBc0IsR0FBdEI7UUFDSSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUN2QixHQUFHLEVBQUUscUNBQXFDO1lBQzFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztTQUNqRCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsK0NBQWtCLEdBQWxCO1FBQ0ksSUFBSSw2QkFBNkIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUMzRCxHQUFHLEVBQUUscUNBQXFDO1NBQzdDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLHdCQUF3QixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUV6RSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN2RCxJQUFJLHVCQUF1QixHQUFHLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUxRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsdUJBQXVCLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLEVBQ3RGLHVCQUF1QixDQUFDLGNBQWMsRUFDdEMsdUJBQXVCLENBQUMsV0FBVyxFQUNuQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUxQyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFsRVEsa0JBQWtCO1FBRDlCLGlCQUFVLEVBQUU7eUNBSzBDLDZDQUFvQjtZQUNwQiw2Q0FBb0I7T0FMOUQsa0JBQWtCLENBbUU5QjtJQUFELHlCQUFDO0NBQUEsQUFuRUQsSUFtRUM7QUFuRVksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbmltcG9ydCB7IENhbGN1bGF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0NhbGN1bGF0aW9uUmVzdWx0XCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5pbXBvcnQgeyBQb3J0Zm9saW9JdGVtU2VydmljZSB9IGZyb20gXCIuL3BvcnRmb2xpby1pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4vY3VycmVuY3ktcHJpY2Uuc2VydmljZVwiO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYWxjdWxhdGlvblNlcnZpY2Uge1xuICAgIHByaXZhdGUgY2FsY3VsYXRpb25SZXN1bHRzOiBBcnJheTxDYWxjdWxhdGlvblJlc3VsdD4gPSBbXTtcbiAgICBwcml2YXRlIHNlY3VyZVN0b3JhZ2U6IFNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY3VycmVuY3lQcmljZVNlcnZpY2U6IEN1cnJlbmN5UHJpY2VTZXJ2aWNlKSB7IH1cblxuICAgIGFkZENhbGN1bGF0aW9uUmVzdWx0KGNhbGN1bGF0aW9uUmVzdWx0KSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRpb25SZXN1bHRzLnB1c2goY2FsY3VsYXRpb25SZXN1bHQpO1xuICAgIH1cblxuXG4gICAgY3JlYXRlQ2FsY3VsYXRpb25SZXN1bHQoc291cmNlUG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZywgdGFyZ2V0Q3VycmVuY3lTeW1ib2w6IHN0cmluZywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IENhbGN1bGF0aW9uUmVzdWx0IHtcbiAgICAgICAgbGV0IHBvcnRmb2xpb0l0ZW0gPSB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUoc291cmNlUG9ydGZvbGlvSXRlbU5hbWUsIHBsYXRmb3JtKTtcbiAgICAgICAgbGV0IGN1cnJlbmN5UHJpY2UgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldEN1cnJlbmN5UHJpY2UocG9ydGZvbGlvSXRlbS5nZXRTeW1ib2woKSwgdGFyZ2V0Q3VycmVuY3lTeW1ib2wsIHBsYXRmb3JtKTtcbiAgICAgICAgXG4gICAgICAgIGxldCBuZXdDYWxjdWxhdGlvblJlc3VsdCA9IG5ldyBDYWxjdWxhdGlvblJlc3VsdChkZXNjcmlwdGlvbiwgcG9ydGZvbGlvSXRlbSwgY3VycmVuY3lQcmljZSwgcGxhdGZvcm0sIHRhcmdldEN1cnJlbmN5U3ltYm9sKTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cy5wdXNoKG5ld0NhbGN1bGF0aW9uUmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gbmV3Q2FsY3VsYXRpb25SZXN1bHQ7XG4gICAgfVxuXG5cbiAgICBjYWxjdWxhdGVBbGxSZXN1bHRzKCkge1xuICAgICAgICBmb3IodmFyIGk9MDsgaTx0aGlzLmNhbGN1bGF0aW9uUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVSZXN1bHQodGhpcy5jYWxjdWxhdGlvblJlc3VsdHNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVzdWx0KGNhbGN1bGF0aW9uUmVzdWx0OiBDYWxjdWxhdGlvblJlc3VsdCkge1xuICAgICAgICBjYWxjdWxhdGlvblJlc3VsdC5nZXRSZXN1bHQoKTtcbiAgICB9XG5cbiAgICBnZXRBbGxDYWxjdWxhdGlvblJlc3VsdHMoKTogQXJyYXk8Q2FsY3VsYXRpb25SZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRpb25SZXN1bHRzO1xuICAgIH1cblxuICAgIC8vVE9ETzogc2F2ZSBhbmQgbG9hZCBoYXZlIHRvIGJlIHJlbmV3ZWRcblxuICAgIHNhdmVDYWxjdWxhdGlvblJlc3VsdHMoKSB7XG4gICAgICAgIHRoaXMuc2VjdXJlU3RvcmFnZS5zZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY0NhbGN1bGF0aW9uUmVzdWx0RGF0YVwiLFxuICAgICAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHRoaXMuY2FsY3VsYXRpb25SZXN1bHRzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkQ3VycmVuY3lQcmljZXMoKSB7XG4gICAgICAgIGxldCBzdG9yZWRDYWxjdWxhdGlvblJlc3VsdFN0cmluZyA9IHRoaXMuc2VjdXJlU3RvcmFnZS5nZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY0NhbGN1bGF0aW9uUmVzdWx0RGF0YVwiLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHRTdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBzdG9yZWRDYWxjdWxhdGlvblJlc3VsdHMgPSBKU09OLnBhcnNlKHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0U3RyaW5nKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdG9yZWRDYWxjdWxhdGlvblJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHQgPSBzdG9yZWRDYWxjdWxhdGlvblJlc3VsdHNbaV07XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUNhbGN1bGF0aW9uUmVzdWx0KHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0LnNvdXJjZVBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZENhbGN1bGF0aW9uUmVzdWx0LnRhcmdldEN1cnJlbmN5LFxuICAgICAgICAgICAgICAgICAgICBzdG9yZWRDYWxjdWxhdGlvblJlc3VsdC5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkQ2FsY3VsYXRpb25SZXN1bHQucGxhdGZvcm0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59Il19