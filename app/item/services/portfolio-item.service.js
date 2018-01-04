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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGZvbGlvLWl0ZW0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvcnRmb2xpby1pdGVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFHM0MsMERBQXlEO0FBQ3pELDJFQUE0RDtBQUc1RDtJQUlJO1FBSEEsbUJBQWMsR0FBNkIsRUFBRSxDQUFDO1FBQ3RDLGtCQUFhLEdBQWtCLElBQUksMkNBQWEsRUFBRSxDQUFDO0lBRTNDLENBQUM7SUFFakIsK0NBQWdCLEdBQWhCLFVBQWlCLGFBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELGtEQUFtQixHQUFuQixVQUFvQixhQUFxQixFQUFFLFdBQW1CLEVBQzFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxNQUFjO1FBQ2xFLEVBQUUsQ0FBQSxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLGFBQWEsR0FBRyxJQUFJLHFDQUFpQixDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV4QyxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxrREFBbUIsR0FBbkIsVUFBb0IsYUFBZ0M7UUFDaEQsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzdDLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENB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aW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuXG5pbXBvcnQgeyBDb2luUG9ydGZvbGlvSXRlbSB9IGZyb20gXCIuLi9Db2luUG9ydGZvbGlvSXRlbVwiO1xuaW1wb3J0IHsgU2VjdXJlU3RvcmFnZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc2VjdXJlLXN0b3JhZ2VcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIHtcbiAgICBwb3J0Zm9saW9JdGVtczogQXJyYXk8Q29pblBvcnRmb2xpb0l0ZW0+ID0gW107XG4gICAgcHJpdmF0ZSBzZWN1cmVTdG9yYWdlOiBTZWN1cmVTdG9yYWdlID0gbmV3IFNlY3VyZVN0b3JhZ2UoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICBhZGRQb3J0Zm9saW9JdGVtKHBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtcy5wdXNoKHBvcnRmb2xpb0l0ZW0pO1xuICAgIH1cblxuXG4gICAgY3JlYXRlUG9ydGZvbGlvSXRlbSh0ZWNobmljYWxOYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IG51bWJlciwgcGxhdGZvcm06IHN0cmluZywgc3ltYm9sOiBzdHJpbmcpOiBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgICAgIGlmKCF0ZWNobmljYWxOYW1lIHx8ICFkZXNjcmlwdGlvbiB8fCAhcGxhdGZvcm0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwb3J0Zm9saW9JdGVtID0gbmV3IENvaW5Qb3J0Zm9saW9JdGVtKHBsYXRmb3JtLCB0ZWNobmljYWxOYW1lLCBkZXNjcmlwdGlvbiwgc3ltYm9sLCBxdWFudGl0eSk7XG5cbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtcy5wdXNoKHBvcnRmb2xpb0l0ZW0pO1xuXG4gICAgICAgIHJldHVybiBwb3J0Zm9saW9JdGVtO1xuICAgIH1cblxuICAgIGRlbGV0ZVBvcnRmb2xpb0l0ZW0ocG9ydGZvbGlvSXRlbTogQ29pblBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8dGhpcy5wb3J0Zm9saW9JdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRQb3J0Zm9saW9JdGVtID0gdGhpcy5wb3J0Zm9saW9JdGVtc1tpXTtcbiAgICAgICAgICAgIGlmKGN1cnJlbnRQb3J0Zm9saW9JdGVtLmdldFBvcnRmb2xpb05hbWUoKSA9PT0gcG9ydGZvbGlvSXRlbS5nZXRQb3J0Zm9saW9OYW1lKCkgJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50UG9ydGZvbGlvSXRlbS5nZXRQb3J0Zm9saW9JdGVtTmFtZSgpID09PSBwb3J0Zm9saW9JdGVtLmdldFBvcnRmb2xpb0l0ZW1OYW1lKCkgJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50UG9ydGZvbGlvSXRlbS5nZXRTeW1ib2woKSA9PT0gcG9ydGZvbGlvSXRlbS5nZXRTeW1ib2woKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1zLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBnZXRQb3J0Zm9saW9JdGVtQnlUZWNobmljYWxOYW1lKHRlY2huaWNhbE5hbWU6IHN0cmluZywgcGxhdGZvcm06IHN0cmluZyk6IENvaW5Qb3J0Zm9saW9JdGVtIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8dGhpcy5wb3J0Zm9saW9JdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYodGhpcy5wb3J0Zm9saW9JdGVtc1tpXS5nZXRQb3J0Zm9saW9JdGVtTmFtZSgpID09PSB0ZWNobmljYWxOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRBbGxQb3J0Zm9saW9JdGVtcygpOiBBcnJheTxDb2luUG9ydGZvbGlvSXRlbT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtcztcbiAgICB9XG5cblxuICAgIHNhdmVQb3J0Zm9saW8oKSB7XG4gICAgICAgIHRoaXMuc2VjdXJlU3RvcmFnZS5zZXRTeW5jKHtcbiAgICAgICAgICAgIGtleTogXCJjcnlwdG9Db2luQ2FsY1BvcnRmb2xpb1wiLFxuICAgICAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHRoaXMucG9ydGZvbGlvSXRlbXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgbG9hZFBvcnRmb2xpbygpIHtcbiAgICAgICAgLy90aGlzLnNlY3VyZVN0b3JhZ2UucmVtb3ZlU3luYyh7a2V5OiBcImNyeXB0b0NvaW5DYWxjUG9ydGZvbGlvXCJ9KTtcblxuICAgICAgICBsZXQgc3RvcmVkUG9ydGZvbGlvU3RyaW5nID0gdGhpcy5zZWN1cmVTdG9yYWdlLmdldFN5bmMoe1xuICAgICAgICAgICAga2V5OiBcImNyeXB0b0NvaW5DYWxjUG9ydGZvbGlvXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzdG9yZWRQb3J0Zm9saW9TdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBzdG9yZWRQb3J0Zm9saW8gPSBKU09OLnBhcnNlKHN0b3JlZFBvcnRmb2xpb1N0cmluZyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3JlZFBvcnRmb2xpby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzdG9yZWRQb3J0Zm9saW9JdGVtID0gc3RvcmVkUG9ydGZvbGlvW2ldO1xuICAgICAgICAgICAgICAgIGxldCBwb3J0Zm9saW9JdGVtID0gdGhpcy5jcmVhdGVQb3J0Zm9saW9JdGVtKHN0b3JlZFBvcnRmb2xpb0l0ZW0ucG9ydGZvbGlvSXRlbU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkUG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkUG9ydGZvbGlvSXRlbS5xdWFudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRQb3J0Zm9saW9JdGVtLnBsYXRmb3JtLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRQb3J0Zm9saW9JdGVtLnN5bWJvbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXBvcnRmb2xpb0l0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQb3J0Zm9saW9JdGVtIFwiICsgc3RvcmVkUG9ydGZvbGlvSXRlbS5wb3J0Zm9saW9JdGVtTmFtZSArIFwiIG5vdCBjcmVhdGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENvdW50T2ZQb3J0Zm9saW9JdGVtcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtcy5sZW5ndGg7XG4gICAgfVxufSJdfQ==