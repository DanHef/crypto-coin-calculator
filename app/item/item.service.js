"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var CurrencyPrice_1 = require("./CurrencyPrice");
var ItemService = (function () {
    function ItemService(http) {
        this.http = http;
    }
    ItemService.prototype.loadDataFromBitfinexWithSymbol = function (currencyPrice) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/" + currencyPrice.getSymbol()).subscribe(function (result) {
                currencyPrice.setPrice(result.json().last_price);
                resolve(currencyPrice);
            });
        });
    };
    ItemService.prototype.loadDataFromBitfinex = function (from, to) {
        return this.loadDataFromBitfinexWithSymbol(new CurrencyPrice_1.CurrencyPrice(from, to, "bitstamp"));
    };
    ItemService.prototype.loadDataFromBitstampWithSymbol = function (currencyPrice) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://www.bitstamp.net/api/v2/ticker/" + currencyPrice.getSymbol()).subscribe(function (result) {
                currencyPrice.setPrice(result.json().last);
                resolve(currencyPrice);
            });
        });
    };
    ItemService.prototype.loadDataFromBitstamp = function (from, to) {
        return this.loadDataFromBitstampWithSymbol(new CurrencyPrice_1.CurrencyPrice(from, to, "bitfinex"));
    };
    ItemService.prototype.loadIotaBTCData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/iotbtc").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadBTCEuroData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/btceur").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadETHUSDData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/ethusd").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadIOTAETHData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/ioteth").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadBTCUSDData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/btcusd").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadDashUSDData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/dshusd").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService.prototype.loadDashBTCData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/pubticker/dshbtc").subscribe(function (result) {
                var data = result.json();
                resolve(data.last_price);
            });
        });
    };
    ItemService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ItemService);
    return ItemService;
}());
exports.ItemService = ItemService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUF3RDtBQUV4RCxpREFBZ0Q7QUFHaEQ7SUFDSSxxQkFBNkIsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07SUFBSSxDQUFDO0lBRTVDLG9EQUE4QixHQUE5QixVQUErQixhQUE0QjtRQUEzRCxpQkFPQztRQU5HLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLE1BQU07Z0JBQ2pHLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUNoRCxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCwwQ0FBb0IsR0FBcEIsVUFBcUIsSUFBWSxFQUFFLEVBQVU7UUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLDZCQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxvREFBOEIsR0FBOUIsVUFBK0IsYUFBNEI7UUFBM0QsaUJBT0M7UUFORyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUNsRyxhQUFhLENBQUMsUUFB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O1lBQy9CLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBTTtnQkFDM0UsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QscUNBQWUsR0FBZjtRQUFBLGlCQU9DO1FBTkcsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUMzRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUE3RlEsV0FBVztRQUR2QixpQkFBVSxFQUFFO3lDQUUwQixXQUFJO09BRDlCLFdBQVcsQ0E4RnZCO0lBQUQsa0JBQUM7Q0FBQSxBQTlGRCxJQThGQztBQTlGWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlIH0gZnJvbSAnLi9DdXJyZW5jeVByaWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEl0ZW1TZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGh0dHA6IEh0dHApIHsgfVxuXG4gICAgbG9hZERhdGFGcm9tQml0ZmluZXhXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2U6IEN1cnJlbmN5UHJpY2UpOiBQcm9taXNlPEN1cnJlbmN5UHJpY2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL1wiICsgY3VycmVuY3lQcmljZS5nZXRTeW1ib2woKSkuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlLnNldFByaWNlKHJlc3VsdC5qc29uKCkubGFzdF9wcmljZSlcbiAgICAgICAgICAgICAgICByZXNvbHZlKGN1cnJlbmN5UHJpY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWREYXRhRnJvbUJpdGZpbmV4KGZyb206IHN0cmluZywgdG86IHN0cmluZyk6IFByb21pc2U8Q3VycmVuY3lQcmljZT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2FkRGF0YUZyb21CaXRmaW5leFdpdGhTeW1ib2wobmV3IEN1cnJlbmN5UHJpY2UoZnJvbSwgdG8sIFwiYml0c3RhbXBcIikpO1xuICAgIH1cblxuICAgIGxvYWREYXRhRnJvbUJpdHN0YW1wV2l0aFN5bWJvbChjdXJyZW5jeVByaWNlOiBDdXJyZW5jeVByaWNlKTogUHJvbWlzZTxDdXJyZW5jeVByaWNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmh0dHAuZ2V0KFwiaHR0cHM6Ly93d3cuYml0c3RhbXAubmV0L2FwaS92Mi90aWNrZXIvXCIgKyBjdXJyZW5jeVByaWNlLmdldFN5bWJvbCgpKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGN1cnJlbmN5UHJpY2Uuc2V0UHJpY2UocmVzdWx0Lmpzb24oKS5sYXN0KVxuICAgICAgICAgICAgICAgIHJlc29sdmUoY3VycmVuY3lQcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZERhdGFGcm9tQml0c3RhbXAoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogUHJvbWlzZTxDdXJyZW5jeVByaWNlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvYWREYXRhRnJvbUJpdHN0YW1wV2l0aFN5bWJvbChuZXcgQ3VycmVuY3lQcmljZShmcm9tLHRvLCBcImJpdGZpbmV4XCIpKTtcbiAgICB9XG5cbiAgICBsb2FkSW90YUJUQ0RhdGEoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL2lvdGJ0Y1wiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEubGFzdF9wcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBsb2FkQlRDRXVyb0RhdGEoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL2J0Y2V1clwiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEubGFzdF9wcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZEVUSFVTRERhdGEoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL2V0aHVzZFwiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEubGFzdF9wcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBsb2FkSU9UQUVUSERhdGEoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL2lvdGV0aFwiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEubGFzdF9wcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZEJUQ1VTRERhdGEoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL2J0Y3VzZFwiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEubGFzdF9wcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZERhc2hVU0REYXRhKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmh0dHAuZ2V0KFwiaHR0cHM6Ly9hcGkuYml0ZmluZXguY29tL3YxL3B1YnRpY2tlci9kc2h1c2RcIikuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5qc29uKCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhLmxhc3RfcHJpY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgbG9hZERhc2hCVENEYXRhKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmh0dHAuZ2V0KFwiaHR0cHM6Ly9hcGkuYml0ZmluZXguY29tL3YxL3B1YnRpY2tlci9kc2hidGNcIikuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5qc29uKCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhLmxhc3RfcHJpY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==