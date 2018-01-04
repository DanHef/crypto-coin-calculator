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
        this.secureStorage.removeSync({ key: "cryptoCoinCalcPortfolio" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGZvbGlvLWl0ZW0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvcnRmb2xpby1pdGVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFHM0MsMERBQXlEO0FBQ3pELDJFQUE0RDtBQUc1RDtJQUlJO1FBSEEsbUJBQWMsR0FBNkIsRUFBRSxDQUFDO1FBQzlDLGtCQUFhLEdBQWtCLElBQUksMkNBQWEsRUFBRSxDQUFDO0lBRW5DLENBQUM7SUFFakIsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixhQUFxQixFQUFFLFdBQW1CLEVBQzFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxNQUFjO1FBQ2xFLEVBQUUsQ0FBQSxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLGFBQWEsR0FBRyxJQUFJLHFDQUFpQixDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV4QyxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFHRCw4REFBK0IsR0FBL0IsVUFBZ0MsYUFBcUIsRUFBRSxRQUFnQjtRQUNuRSxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsbURBQW9CLEdBQXBCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUdELDRDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUN2QixHQUFHLEVBQUUseUJBQXlCO1lBQzlCLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDN0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELDRDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFDLEdBQUcsRUFBRSx5QkFBeUIsRUFBQyxDQUFDLENBQUM7UUFFaEUsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUNuRCxHQUFHLEVBQUUseUJBQXlCO1NBQ2pDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDeEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlDLElBQUksbUJBQW1CLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsK0JBQStCLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLEVBQzFGLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUV2QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQixhQUFhLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLENBQUM7Z0JBQzNGLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCx1REFBd0IsR0FBeEI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7SUFDdEMsQ0FBQztJQXhFUSxvQkFBb0I7UUFEaEMsaUJBQVUsRUFBRTs7T0FDQSxvQkFBb0IsQ0F5RWhDO0lBQUQsMkJBQUM7Q0FBQSxBQXpFRCxJQXlFQztBQXpFWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcblxuaW1wb3J0IHsgQ29pblBvcnRmb2xpb0l0ZW0gfSBmcm9tIFwiLi4vQ29pblBvcnRmb2xpb0l0ZW1cIjtcbmltcG9ydCB7IFNlY3VyZVN0b3JhZ2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNlY3VyZS1zdG9yYWdlXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW9JdGVtU2VydmljZSB7XG4gICAgcG9ydGZvbGlvSXRlbXM6IEFycmF5PENvaW5Qb3J0Zm9saW9JdGVtPiA9IFtdO1xuICAgIHNlY3VyZVN0b3JhZ2U6IFNlY3VyZVN0b3JhZ2UgPSBuZXcgU2VjdXJlU3RvcmFnZSgpO1xuXG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIGFkZFBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbSkge1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1zLnB1c2gocG9ydGZvbGlvSXRlbSk7XG4gICAgfVxuXG5cbiAgICBjcmVhdGVQb3J0Zm9saW9JdGVtKHRlY2huaWNhbE5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogbnVtYmVyLCBwbGF0Zm9ybTogc3RyaW5nLCBzeW1ib2w6IHN0cmluZyk6IENvaW5Qb3J0Zm9saW9JdGVtIHtcbiAgICAgICAgaWYoIXRlY2huaWNhbE5hbWUgfHwgIWRlc2NyaXB0aW9uIHx8ICFwbGF0Zm9ybSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvcnRmb2xpb0l0ZW0gPSBuZXcgQ29pblBvcnRmb2xpb0l0ZW0ocGxhdGZvcm0sIHRlY2huaWNhbE5hbWUsIGRlc2NyaXB0aW9uLCBzeW1ib2wsIHF1YW50aXR5KTtcblxuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1zLnB1c2gocG9ydGZvbGlvSXRlbSk7XG5cbiAgICAgICAgcmV0dXJuIHBvcnRmb2xpb0l0ZW07XG4gICAgfVxuXG5cbiAgICBnZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHRlY2huaWNhbE5hbWU6IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IENvaW5Qb3J0Zm9saW9JdGVtIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8dGhpcy5wb3J0Zm9saW9JdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYodGhpcy5wb3J0Zm9saW9JdGVtc1tpXS5nZXRQb3J0Zm9saW9JdGVtTmFtZSgpID09PSB0ZWNobmljYWxOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRBbGxQb3J0Zm9saW9JdGVtcygpOiBBcnJheTxDb2luUG9ydGZvbGlvSXRlbT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtcztcbiAgICB9XG5cblxuICAgIHNhdmVQb3J0Zm9saW8oKSB7XG4gICAgICAgIHRoaXMuc2VjdXJlU3RvcmFnZS5zZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1BvcnRmb2xpb1wiLFxuICAgICAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHRoaXMucG9ydGZvbGlvSXRlbXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgbG9hZFBvcnRmb2xpbygpIHtcbiAgICAgICAgdGhpcy5zZWN1cmVTdG9yYWdlLnJlbW92ZVN5bmMoe2tleTogXCJjcnlwdG9Db2luQ2FsY1BvcnRmb2xpb1wifSk7XG5cbiAgICAgICAgbGV0IHN0b3JlZFBvcnRmb2xpb1N0cmluZyA9IHRoaXMuc2VjdXJlU3RvcmFnZS5nZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1BvcnRmb2xpb1wiLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc3RvcmVkUG9ydGZvbGlvU3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgc3RvcmVkUG9ydGZvbGlvID0gSlNPTi5wYXJzZShzdG9yZWRQb3J0Zm9saW9TdHJpbmcpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdG9yZWRQb3J0Zm9saW8ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RvcmVkUG9ydGZvbGlvSXRlbSA9IHN0b3JlZFBvcnRmb2xpb1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgcG9ydGZvbGlvSXRlbSA9IHRoaXMuZ2V0UG9ydGZvbGlvSXRlbUJ5VGVjaG5pY2FsTmFtZShzdG9yZWRQb3J0Zm9saW9JdGVtLnBvcnRmb2xpb0l0ZW1OYW1lLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZWRQb3J0Zm9saW9JdGVtLnBvcnRmb2xpb05hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcG9ydGZvbGlvSXRlbS5zZXRRdWFudGl0eShzdG9yZWRQb3J0Zm9saW9JdGVtLnF1YW50aXR5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBvcnRmb2xpb0l0ZW0gXCIgKyBzdG9yZWRQb3J0Zm9saW9JdGVtLnBvcnRmb2xpb0l0ZW1OYW1lICsgXCIgbm90IGNyZWF0ZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q291bnRPZlBvcnRmb2xpb0l0ZW1zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1zLmxlbmd0aDtcbiAgICB9XG59Il19