"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var ItemService = /** @class */ (function () {
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
    /*loadDataFromBitfinex(from: string, to: string): Promise<CurrencyPrice> {
        return this.loadDataFromBitfinexWithSymbol(new CurrencyPrice(from, to, "bitstamp"));
    }*/
    ItemService.prototype.loadDataFromBitstampWithSymbol = function (currencyPrice) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://www.bitstamp.net/api/v2/ticker/" + currencyPrice.getSymbol()).subscribe(function (result) {
                currencyPrice.setPrice(result.json().last);
                resolve(currencyPrice);
            });
        });
    };
    /*loadDataFromBitstamp(from: string, to: string): Promise<CurrencyPrice> {
        return this.loadDataFromBitstampWithSymbol(new CurrencyPrice(from,to, "bitfinex"));
    }*/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUF3RDtBQUt4RDtJQUNJLHFCQUE2QixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFJLENBQUM7SUFFNUMsb0RBQThCLEdBQTlCLFVBQStCLGFBQTRCO1FBQTNELGlCQU9DO1FBTkcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLE1BQU07Z0JBQ2pHLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUNoRCxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUVILG9EQUE4QixHQUE5QixVQUErQixhQUE0QjtRQUEzRCxpQkFPQztRQU5HLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUNsRyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDMUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7O09BRUc7SUFFSCxxQ0FBZSxHQUFmO1FBQUEsaUJBT0M7UUFORyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUMzRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxxQ0FBZSxHQUFmO1FBQUEsaUJBT0M7UUFORyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUMzRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxvQ0FBYyxHQUFkO1FBQUEsaUJBT0M7UUFORyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUMzRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxxQ0FBZSxHQUFmO1FBQUEsaUJBT0M7UUFORyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUMzRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxvQ0FBYyxHQUFkO1FBQUEsaUJBT0M7UUFORyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUMzRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxxQ0FBZSxHQUFmO1FBQUEsaUJBT0M7UUFORyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUMzRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxxQ0FBZSxHQUFmO1FBQUEsaUJBT0M7UUFORyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO2dCQUMzRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUE3RlEsV0FBVztRQUR2QixpQkFBVSxFQUFFO3lDQUUwQixXQUFJO09BRDlCLFdBQVcsQ0E4RnZCO0lBQUQsa0JBQUM7Q0FBQSxBQTlGRCxJQThGQztBQTlGWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlIH0gZnJvbSAnLi9DdXJyZW5jeVByaWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEl0ZW1TZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGh0dHA6IEh0dHApIHsgfVxuXG4gICAgbG9hZERhdGFGcm9tQml0ZmluZXhXaXRoU3ltYm9sKGN1cnJlbmN5UHJpY2U6IEN1cnJlbmN5UHJpY2UpOiBQcm9taXNlPEN1cnJlbmN5UHJpY2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL1wiICsgY3VycmVuY3lQcmljZS5nZXRTeW1ib2woKSkuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlLnNldFByaWNlKHJlc3VsdC5qc29uKCkubGFzdF9wcmljZSlcbiAgICAgICAgICAgICAgICByZXNvbHZlKGN1cnJlbmN5UHJpY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qbG9hZERhdGFGcm9tQml0ZmluZXgoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogUHJvbWlzZTxDdXJyZW5jeVByaWNlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvYWREYXRhRnJvbUJpdGZpbmV4V2l0aFN5bWJvbChuZXcgQ3VycmVuY3lQcmljZShmcm9tLCB0bywgXCJiaXRzdGFtcFwiKSk7XG4gICAgfSovXG5cbiAgICBsb2FkRGF0YUZyb21CaXRzdGFtcFdpdGhTeW1ib2woY3VycmVuY3lQcmljZTogQ3VycmVuY3lQcmljZSk6IFByb21pc2U8Q3VycmVuY3lQcmljZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldChcImh0dHBzOi8vd3d3LmJpdHN0YW1wLm5ldC9hcGkvdjIvdGlja2VyL1wiICsgY3VycmVuY3lQcmljZS5nZXRTeW1ib2woKSkuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBjdXJyZW5jeVByaWNlLnNldFByaWNlKHJlc3VsdC5qc29uKCkubGFzdClcbiAgICAgICAgICAgICAgICByZXNvbHZlKGN1cnJlbmN5UHJpY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qbG9hZERhdGFGcm9tQml0c3RhbXAoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogUHJvbWlzZTxDdXJyZW5jeVByaWNlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvYWREYXRhRnJvbUJpdHN0YW1wV2l0aFN5bWJvbChuZXcgQ3VycmVuY3lQcmljZShmcm9tLHRvLCBcImJpdGZpbmV4XCIpKTtcbiAgICB9Ki9cblxuICAgIGxvYWRJb3RhQlRDRGF0YSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldChcImh0dHBzOi8vYXBpLmJpdGZpbmV4LmNvbS92MS9wdWJ0aWNrZXIvaW90YnRjXCIpLnN1YnNjcmliZSgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuanNvbigpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5sYXN0X3ByaWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGxvYWRCVENFdXJvRGF0YSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldChcImh0dHBzOi8vYXBpLmJpdGZpbmV4LmNvbS92MS9wdWJ0aWNrZXIvYnRjZXVyXCIpLnN1YnNjcmliZSgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuanNvbigpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5sYXN0X3ByaWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkRVRIVVNERGF0YSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldChcImh0dHBzOi8vYXBpLmJpdGZpbmV4LmNvbS92MS9wdWJ0aWNrZXIvZXRodXNkXCIpLnN1YnNjcmliZSgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuanNvbigpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5sYXN0X3ByaWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGxvYWRJT1RBRVRIRGF0YSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldChcImh0dHBzOi8vYXBpLmJpdGZpbmV4LmNvbS92MS9wdWJ0aWNrZXIvaW90ZXRoXCIpLnN1YnNjcmliZSgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuanNvbigpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5sYXN0X3ByaWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkQlRDVVNERGF0YSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldChcImh0dHBzOi8vYXBpLmJpdGZpbmV4LmNvbS92MS9wdWJ0aWNrZXIvYnRjdXNkXCIpLnN1YnNjcmliZSgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuanNvbigpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5sYXN0X3ByaWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkRGFzaFVTRERhdGEoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL2RzaHVzZFwiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEubGFzdF9wcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBsb2FkRGFzaEJUQ0RhdGEoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvcHVidGlja2VyL2RzaGJ0Y1wiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEubGFzdF9wcmljZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19