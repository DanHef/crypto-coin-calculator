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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGZvbGlvLWl0ZW0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvcnRmb2xpby1pdGVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFHM0MsMERBQXlEO0FBQ3pELDJFQUE0RDtBQUc1RDtJQUlJO1FBSEEsbUJBQWMsR0FBNkIsRUFBRSxDQUFDO1FBQzlDLGtCQUFhLEdBQWtCLElBQUksMkNBQWEsRUFBRSxDQUFDO0lBRW5DLENBQUM7SUFFakIsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixhQUFxQixFQUFFLFdBQW1CLEVBQzFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxNQUFjO1FBQ2xFLEVBQUUsQ0FBQSxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLGFBQWEsR0FBRyxJQUFJLHFDQUFpQixDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV4QyxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFHRCw4REFBK0IsR0FBL0IsVUFBZ0MsYUFBcUIsRUFBRSxRQUFnQjtRQUNuRSxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsbURBQW9CLEdBQXBCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUdELDRDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUN2QixHQUFHLEVBQUUseUJBQXlCO1lBQzlCLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDN0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELDRDQUFhLEdBQWI7UUFDSSxrRUFBa0U7UUFFbEUsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUNuRCxHQUFHLEVBQUUseUJBQXlCO1NBQ2pDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDeEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlDLElBQUksbUJBQW1CLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLEVBQ2xDLG1CQUFtQixDQUFDLHdCQUF3QixFQUM1QyxtQkFBbUIsQ0FBQyxRQUFRLEVBQzVCLG1CQUFtQixDQUFDLFFBQVEsRUFDNUIsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRTVFLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxpQkFBaUIsR0FBRyxjQUFjLENBQUMsQ0FBQztnQkFDM0YsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELHVEQUF3QixHQUF4QjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxDQUFDO0lBekVRLG9CQUFvQjtRQURoQyxpQkFBVSxFQUFFOztPQUNBLG9CQUFvQixDQTBFaEM7SUFBRCwyQkFBQztDQUFBLEFBMUVELElBMEVDO0FBMUVZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuXG5pbXBvcnQgeyBDb2luUG9ydGZvbGlvSXRlbSB9IGZyb20gXCIuLi9Db2luUG9ydGZvbGlvSXRlbVwiO1xuaW1wb3J0IHsgU2VjdXJlU3RvcmFnZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc2VjdXJlLXN0b3JhZ2VcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIHtcbiAgICBwb3J0Zm9saW9JdGVtczogQXJyYXk8Q29pblBvcnRmb2xpb0l0ZW0+ID0gW107XG4gICAgc2VjdXJlU3RvcmFnZTogU2VjdXJlU3RvcmFnZSA9IG5ldyBTZWN1cmVTdG9yYWdlKCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgYWRkUG9ydGZvbGlvSXRlbShwb3J0Zm9saW9JdGVtKSB7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbXMucHVzaChwb3J0Zm9saW9JdGVtKTtcbiAgICB9XG5cblxuICAgIGNyZWF0ZVBvcnRmb2xpb0l0ZW0odGVjaG5pY2FsTmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBudW1iZXIsIHBsYXRmb3JtOiBzdHJpbmcsIHN5bWJvbDogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICBpZighdGVjaG5pY2FsTmFtZSB8fCAhZGVzY3JpcHRpb24gfHwgIXBsYXRmb3JtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9ydGZvbGlvSXRlbSA9IG5ldyBDb2luUG9ydGZvbGlvSXRlbShwbGF0Zm9ybSwgdGVjaG5pY2FsTmFtZSwgZGVzY3JpcHRpb24sIHN5bWJvbCwgcXVhbnRpdHkpO1xuXG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbXMucHVzaChwb3J0Zm9saW9JdGVtKTtcblxuICAgICAgICByZXR1cm4gcG9ydGZvbGlvSXRlbTtcbiAgICB9XG5cblxuICAgIGdldFBvcnRmb2xpb0l0ZW1CeVRlY2huaWNhbE5hbWUodGVjaG5pY2FsTmFtZTogc3RyaW5nLCBwbGF0Zm9ybTogc3RyaW5nKTogQ29pblBvcnRmb2xpb0l0ZW0ge1xuICAgICAgICBmb3IodmFyIGk9MDsgaTx0aGlzLnBvcnRmb2xpb0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZih0aGlzLnBvcnRmb2xpb0l0ZW1zW2ldLmdldFBvcnRmb2xpb0l0ZW1OYW1lKCkgPT09IHRlY2huaWNhbE5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldEFsbFBvcnRmb2xpb0l0ZW1zKCk6IEFycmF5PENvaW5Qb3J0Zm9saW9JdGVtPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1zO1xuICAgIH1cblxuXG4gICAgc2F2ZVBvcnRmb2xpbygpIHtcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnNldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUG9ydGZvbGlvXCIsXG4gICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkodGhpcy5wb3J0Zm9saW9JdGVtcylcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBsb2FkUG9ydGZvbGlvKCkge1xuICAgICAgICAvL3RoaXMuc2VjdXJlU3RvcmFnZS5yZW1vdmVTeW5jKHtrZXk6IFwiY3J5cHRvQ29pbkNhbGNQb3J0Zm9saW9cIn0pO1xuXG4gICAgICAgIGxldCBzdG9yZWRQb3J0Zm9saW9TdHJpbmcgPSB0aGlzLnNlY3VyZVN0b3JhZ2UuZ2V0U3luYyh7XG4gICAgICAgICAgICBrZXk6IFwiY3J5cHRvQ29pbkNhbGNQb3J0Zm9saW9cIixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHN0b3JlZFBvcnRmb2xpb1N0cmluZykge1xuICAgICAgICAgICAgbGV0IHN0b3JlZFBvcnRmb2xpbyA9IEpTT04ucGFyc2Uoc3RvcmVkUG9ydGZvbGlvU3RyaW5nKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RvcmVkUG9ydGZvbGlvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlZFBvcnRmb2xpb0l0ZW0gPSBzdG9yZWRQb3J0Zm9saW9baV07XG4gICAgICAgICAgICAgICAgbGV0IHBvcnRmb2xpb0l0ZW0gPSB0aGlzLmNyZWF0ZVBvcnRmb2xpb0l0ZW0oc3RvcmVkUG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRQb3J0Zm9saW9JdGVtLnBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRQb3J0Zm9saW9JdGVtLnF1YW50aXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlZFBvcnRmb2xpb0l0ZW0ucGxhdGZvcm0sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlZFBvcnRmb2xpb0l0ZW0uc3ltYm9sKTtcblxuICAgICAgICAgICAgICAgIGlmICghcG9ydGZvbGlvSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBvcnRmb2xpb0l0ZW0gXCIgKyBzdG9yZWRQb3J0Zm9saW9JdGVtLnBvcnRmb2xpb0l0ZW1OYW1lICsgXCIgbm90IGNyZWF0ZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q291bnRPZlBvcnRmb2xpb0l0ZW1zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1zLmxlbmd0aDtcbiAgICB9XG59Il19