"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CoinPortfolioItem_1 = require("../CoinPortfolioItem");
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var PortfolioItemService = (function () {
    function PortfolioItemService() {
        this.portfolioItems = [];
        this.secureStorage = new nativescript_secure_storage_1.SecureStorage();
    }
    PortfolioItemService.prototype.addPortfolioItem = function (portfolioItem) {
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
        var storedPortfolioString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPortfolio",
        });
        if (storedPortfolioString) {
            var storedPortfolio = JSON.parse(storedPortfolioString);
            for (var i = 0; i < storedPortfolio.length; i++) {
                var storedPortfolioItem = storedPortfolio[i];
                var portfolioItem = this.getPortfolioItemByTechnicalName(storedPortfolioItem.portfolioItemName, storedPortfolioItem.portfolioName);
                if (portfolioItem) {
                    portfolioItem.setQuantity(storedPortfolioItem.quantity);
                }
                else {
                    console.log("PortfolioItem " + storedPortfolioItem.portfolioItemName + " not created");
                }
            }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGZvbGlvLWl0ZW0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvcnRmb2xpby1pdGVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFHM0MsMERBQXlEO0FBQ3pELDJFQUE0RDtBQUc1RDtJQUlJO1FBSEEsbUJBQWMsR0FBNkIsRUFBRSxDQUFDO1FBQzlDLGtCQUFhLEdBQWtCLElBQUksMkNBQWEsRUFBRSxDQUFDO0lBRW5DLENBQUM7SUFFakIsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixhQUFxQixFQUFFLFdBQW1CLEVBQzFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxNQUFjO1FBQ2xFLEVBQUUsQ0FBQSxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLGFBQWEsR0FBRyxJQUFJLHFDQUFpQixDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV4QyxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFHRCw4REFBK0IsR0FBL0IsVUFBZ0MsYUFBcUIsRUFBRSxRQUFnQjtRQUNuRSxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsbURBQW9CLEdBQXBCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUdELDRDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUN2QixHQUFHLEVBQUUseUJBQXlCO1lBQzlCLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDN0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELDRDQUFhLEdBQWI7UUFDSSxJQUFJLHFCQUFxQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1lBQ25ELEdBQUcsRUFBRSx5QkFBeUI7U0FDakMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUN4RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDOUMsSUFBSSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFDMUYsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRXZDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLGFBQWEsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzVELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxpQkFBaUIsR0FBRyxjQUFjLENBQUMsQ0FBQztnQkFDM0YsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELHVEQUF3QixHQUF4QjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxDQUFDO0lBdEVRLG9CQUFvQjtRQURoQyxpQkFBVSxFQUFFOztPQUNBLG9CQUFvQixDQXVFaEM7SUFBRCwyQkFBQztDQUFBLEFBdkVELElBdUVDO0FBdkVZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuXG5pbXBvcnQgeyBDb2luUG9ydGZvbGlvSXRlbSB9IGZyb20gXCIuLi9Db2luUG9ydGZvbGlvSXRlbVwiO1xuaW1wb3J0IHsgU2VjdXJlU3RvcmFnZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc2VjdXJlLXN0b3JhZ2VcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIHtcbiAgICBwb3J0Zm9saW9JdGVtczogQXJyYXk8Q29pblBvcnRmb2xpb0l0ZW0+ID0gW107XG4gICAgc2VjdXJlU3RvcmFnZTogU2VjdXJlU3RvcmFnZSA9IG5ldyBTZWN1cmVTdG9yYWdlKCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgYWRkUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtKSB7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbXMucHVzaChwb3J0Zm9saW9JdGVtKTtcbiAgICB9XG5cblxuICAgIGNyZWF0ZVBvcnRmb2xpb0l0ZW0odGVjaG5pY2FsTmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBudW1iZXIsIHBsYXRmb3JtOiBzdHJpbmcsIHN5bWJvbDogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICBpZighdGVjaG5pY2FsTmFtZSB8fCAhZGVzY3JpcHRpb24gfHwgIXBsYXRmb3JtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9ydGZvbGlvSXRlbSA9IG5ldyBDb2luUG9ydGZvbGlvSXRlbShwbGF0Zm9ybSwgdGVjaG5pY2FsTmFtZSwgZGVzY3JpcHRpb24sIHN5bWJvbCwgcXVhbnRpdHkpO1xuXG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbXMucHVzaChwb3J0Zm9saW9JdGVtKTtcblxuICAgICAgICByZXR1cm4gcG9ydGZvbGlvSXRlbTtcbiAgICB9XG5cblxuICAgIGdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUodGVjaG5pY2FsTmFtZTogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICBmb3IodmFyIGk9MDsgaTx0aGlzLnBvcnRmb2xpb0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZih0aGlzLnBvcnRmb2xpb0l0ZW1zW2ldLmdldFBvcnRmb2xpb0l0ZW1OYW1lKCkgPT09IHRlY2huaWNhbE5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldEFsbFBvcnRmb2xpb0l0ZW1zKCk6IEFycmF5PENvaW5Qb3J0Zm9saW9JdGVtPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1zO1xuICAgIH1cblxuXG4gICAgc2F2ZVBvcnRmb2xpbygpIHtcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUG9ydGZvbGlvXCIsXG4gICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkodGhpcy5wb3J0Zm9saW9JdGVtcylcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBsb2FkUG9ydGZvbGlvKCkge1xuICAgICAgICBsZXQgc3RvcmVkUG9ydGZvbGlvU3RyaW5nID0gdGhpcy5zZWN1cmVTdG9yYWdlLmdldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUG9ydGZvbGlvXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdG9yZWRQb3J0Zm9saW9TdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBzdG9yZWRQb3J0Zm9saW8gPSBKU09OLnBhcnNlKHN0b3JlZFBvcnRmb2xpb1N0cmluZyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZFBvcnRmb2xpby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzdG9yZWRQb3J0Zm9saW9JdGVtID0gc3RvcmVkUG9ydGZvbGlvW2ldO1xuICAgICAgICAgICAgICAgIGxldCBwb3J0Zm9saW9JdGVtID0gdGhpcy5nZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocG9ydGZvbGlvSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBwb3J0Zm9saW9JdGVtLnNldFF1YW50aXR5KHN0b3JlZFBvcnRmb2xpb0l0ZW0ucXVhbnRpdHkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUG9ydGZvbGlvSXRlbSBcIiArIHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbU5hbWUgKyBcIiBub3QgY3JlYXRlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDb3VudE9mUG9ydGZvbGlvSXRlbXMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbXMubGVuZ3RoO1xuICAgIH1cbn0iXX0=