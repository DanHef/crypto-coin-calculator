"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CoinPortfolioItem_1 = require("../CoinPortfolioItem");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var PortfolioItemService = /** @class */ (function () {
    function PortfolioItemService() {
        this.portfolioItems = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
    }
    PortfolioItemService.prototype.addPortfolioItem = function (portfolioItem) {
        portfolioItem.setSortOrderNumber(this.portfolioItems.length);
        this.portfolioItems.push(portfolioItem);
    };
    PortfolioItemService.prototype.createPortfolioItem = function (technicalName, description, quantity, platform, symbol) {
        if (!technicalName || !description || !platform) {
            return null;
        }
        var portfolioItem = new CoinPortfolioItem_1.CoinPortfolioItem(platform, technicalName, description, symbol, quantity);
        this.portfolioItems.push(portfolioItem);
        return portfolioItem;
    };
    PortfolioItemService.prototype.deletePortfolioItem = function (portfolioItem) {
        for (var i = 0; i < this.portfolioItems.length; i++) {
            var currentPortfolioItem = this.portfolioItems[i];
            if (currentPortfolioItem.getPortfolioName() === portfolioItem.getPortfolioName() &&
                currentPortfolioItem.getPortfolioItemName() === portfolioItem.getPortfolioItemName() &&
                currentPortfolioItem.getSymbol() === portfolioItem.getSymbol()) {
                this.portfolioItems.splice(i, 1);
            }
        }
    };
    PortfolioItemService.prototype.getPortfolioItemByTechnicalName = function (technicalName, platform) {
        for (var i = 0; i < this.portfolioItems.length; i++) {
            if (this.portfolioItems[i].getPortfolioItemName() === technicalName) {
                return this.portfolioItems[i];
            }
        }
        return null;
    };
    PortfolioItemService.prototype.getAllPortfolioItems = function () {
        return this.portfolioItems;
    };
    PortfolioItemService.prototype.savePortfolio = function () {
        this.secureStorage.setSync({
            key: "cryptoCoinCalcPortfolio",
            value: JSON.stringify(this.portfolioItems)
        });
    };
    PortfolioItemService.prototype.loadPortfolio = function () {
        //this.secureStorage.removeSync({key: "cryptoCoinCalcPortfolio"});
        var storedPortfolioString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPortfolio",
        });
        if (storedPortfolioString) {
            var storedPortfolio = JSON.parse(storedPortfolioString);
            for (var i = 0; i < storedPortfolio.length; i++) {
                var storedPortfolioItem = storedPortfolio[i];
                var portfolioItem = this.createPortfolioItem(storedPortfolioItem.portfolioItemName, storedPortfolioItem.portfolioItemDescription, storedPortfolioItem.quantity, storedPortfolioItem.platform, storedPortfolioItem.symbol);
                if (!portfolioItem) {
                    console.log("PortfolioItem " + storedPortfolioItem.portfolioItemName + " not created");
                }
            }
        }
        console.log("Sorting");
        this.portfolioItems.sort(function (a, b) {
            return a.getSortOrderNumber() - b.getSortOrderNumber();
        });
    };
    PortfolioItemService.prototype.getCountOfPortfolioItems = function () {
        return this.portfolioItems.length;
    };
    PortfolioItemService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], PortfolioItemService);
    return PortfolioItemService;
}());
exports.PortfolioItemService = PortfolioItemService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGZvbGlvLWl0ZW0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvcnRmb2xpby1pdGVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFHM0MsMERBQXlEO0FBQ3pELDJFQUE0RDtBQUc1RDtJQUlJO1FBSEEsbUJBQWMsR0FBNkIsRUFBRSxDQUFDO1FBQ3RDLGtCQUFhLEdBQWtCLElBQUksMkNBQWEsRUFBRSxDQUFDO0lBRTNDLENBQUM7SUFFakIsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsYUFBYSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixhQUFxQixFQUFFLFdBQW1CLEVBQzFELFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxNQUFjO1FBQ2xELElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDN0MsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELElBQUksYUFBYSxHQUFHLElBQUkscUNBQWlCLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWxHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhDLE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxrREFBbUIsR0FBbkIsVUFBb0IsYUFBZ0M7UUFDaEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pELElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMs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ZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5cbmltcG9ydCB7IENvaW5Qb3J0Zm9saW9JdGVtIH0gZnJvbSBcIi4uL0NvaW5Qb3J0Zm9saW9JdGVtXCI7XG5pbXBvcnQgeyBTZWN1cmVTdG9yYWdlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zZWN1cmUtc3RvcmFnZVwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9ydGZvbGlvSXRlbVNlcnZpY2Uge1xuICAgIHBvcnRmb2xpb0l0ZW1zOiBBcnJheTxDb2luUG9ydGZvbGlvSXRlbT4gPSBbXTtcbiAgICBwcml2YXRlIHNlY3VyZVN0b3JhZ2U6IFNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuXG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIGFkZFBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbSkge1xuICAgICAgICBwb3J0Zm9saW9JdGVtLnNldFNvcnRPcmRlck51bWJlcih0aGlzLnBvcnRmb2xpb0l0ZW1zLmxlbmd0aCk7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbXMucHVzaChwb3J0Zm9saW9JdGVtKTtcbiAgICB9XG5cblxuICAgIGNyZWF0ZVBvcnRmb2xpb0l0ZW0odGVjaG5pY2FsTmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLFxuICAgICAgICBxdWFudGl0eTogbnVtYmVyLCBwbGF0Zm9ybTogc3RyaW5nLCBzeW1ib2w6IHN0cmluZyk6IENvaW5Qb3J0Zm9saW9JdGVtIHtcbiAgICAgICAgaWYgKCF0ZWNobmljYWxOYW1lIHx8ICFkZXNjcmlwdGlvbiB8fCAhcGxhdGZvcm0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwb3J0Zm9saW9JdGVtID0gbmV3IENvaW5Qb3J0Zm9saW9JdGVtKHBsYXRmb3JtLCB0ZWNobmljYWxOYW1lLCBkZXNjcmlwdGlvbiwgc3ltYm9sLCBxdWFudGl0eSk7XG5cbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtcy5wdXNoKHBvcnRmb2xpb0l0ZW0pO1xuXG4gICAgICAgIHJldHVybiBwb3J0Zm9saW9JdGVtO1xuICAgIH1cblxuICAgIGRlbGV0ZVBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbTogQ29pblBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBvcnRmb2xpb0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFBvcnRmb2xpb0l0ZW0gPSB0aGlzLnBvcnRmb2xpb0l0ZW1zW2ldO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRQb3J0Zm9saW9JdGVtLmdldFBvcnRmb2xpb05hbWUoKSA9PT0gcG9ydGZvbGlvSXRlbS5nZXRQb3J0Zm9saW9OYW1lKCkgJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50UG9ydGZvbGlvSXRlbS5nZXRQb3J0Zm9saW9JdGVtTmFtZSgpID09PSBwb3J0Zm9saW9JdGVtLmdldFBvcnRmb2xpb0l0ZW1OYW1lKCkgJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50UG9ydGZvbGlvSXRlbS5nZXRTeW1ib2woKSA9PT0gcG9ydGZvbGlvSXRlbS5nZXRTeW1ib2woKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBnZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHRlY2huaWNhbE5hbWU6IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IENvaW5Qb3J0Zm9saW9JdGVtIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBvcnRmb2xpb0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wb3J0Zm9saW9JdGVtc1tpXS5nZXRQb3J0Zm9saW9JdGVtTmFtZSgpID09PSB0ZWNobmljYWxOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRBbGxQb3J0Zm9saW9JdGVtcygpOiBBcnJheTxDb2luUG9ydGZvbGlvSXRlbT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtcztcbiAgICB9XG5cblxuICAgIHNhdmVQb3J0Zm9saW8oKSB7XG4gICAgICAgIHRoaXMuc2VjdXJlU3RvcmFnZS5zZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1BvcnRmb2xpb1wiLFxuICAgICAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHRoaXMucG9ydGZvbGlvSXRlbXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgbG9hZFBvcnRmb2xpbygpIHtcbiAgICAgICAgLy90aGlzLnNlY3VyZVN0b3JhZ2UucmVtb3ZlU3luYyh7a2V5OiBcImNyeXB0b0NvaW5DYWxjUG9ydGZvbGlvXCJ9KTtcblxuICAgICAgICBsZXQgc3RvcmVkUG9ydGZvbGlvU3RyaW5nID0gdGhpcy5zZWN1cmVTdG9yYWdlLmdldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUG9ydGZvbGlvXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdG9yZWRQb3J0Zm9saW9TdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBzdG9yZWRQb3J0Zm9saW8gPSBKU09OLnBhcnNlKHN0b3JlZFBvcnRmb2xpb1N0cmluZyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZFBvcnRmb2xpby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzdG9yZWRQb3J0Zm9saW9JdGVtID0gc3RvcmVkUG9ydGZvbGlvW2ldO1xuICAgICAgICAgICAgICAgIGxldCBwb3J0Zm9saW9JdGVtID0gdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbURlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZWRQb3J0Zm9saW9JdGVtLnF1YW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBzdG9yZWRQb3J0Zm9saW9JdGVtLnBsYXRmb3JtLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZWRQb3J0Zm9saW9JdGVtLnN5bWJvbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQb3J0Zm9saW9JdGVtIFwiICsgc3RvcmVkUG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSArIFwiIG5vdCBjcmVhdGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU29ydGluZ1wiKTtcblxuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhLmdldFNvcnRPcmRlck51bWJlcigpIC0gYi5nZXRTb3J0T3JkZXJOdW1iZXIoKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRDb3VudE9mUG9ydGZvbGlvSXRlbXMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbXMubGVuZ3RoO1xuICAgIH1cbn0iXX0=