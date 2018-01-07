"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var CurrencyPrice_1 = require("../CurrencyPrice");
var PlatformService = (function () {
    function PlatformService(http) {
        this.http = http;
    }
    //bitstamp symbols
    //https://www.bitstamp.net/api/v2/trading-pairs-info/
    PlatformService.prototype.readAllBitstampSymbols = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://www.bitstamp.net/api/v2/trading-pairs-info/").subscribe(function (result) {
                var bitstampSymbols = result.json();
                var bitstampCurrencyPrices = [];
                for (var i = 0; i < bitstampSymbols.length; i++) {
                    var bitstampSymbol = bitstampSymbols[i];
                    bitstampCurrencyPrices.push(_this.createCurrencyPriceFromSymbol(bitstampSymbol.url_symbol, "bitstamp"));
                }
                resolve(bitstampCurrencyPrices);
            });
        });
    };
    //bitfinex symbols
    //https://api.bitfinex.com/v1/symbols
    PlatformService.prototype.readAllBitfinexSymbols = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.bitfinex.com/v1/symbols").subscribe(function (result) {
                var symbols = result.json();
                var bitfinexCurrencyPrices = [];
                for (var i = 0; i < symbols.length; i++) {
                    var bitfinexSymbol = symbols[i];
                    bitfinexCurrencyPrices.push(_this.createCurrencyPriceFromSymbol(bitfinexSymbol, "bitfinex"));
                }
                resolve(bitfinexCurrencyPrices);
            });
        });
    };
    PlatformService.prototype.createCurrencyPriceFromSymbol = function (symbolPair, platform) {
        var sourceSymbol = symbolPair.slice(0, 3);
        var targetSymbol = symbolPair.slice(3, 6);
        return new CurrencyPrice_1.CurrencyPrice(sourceSymbol, targetSymbol, platform);
    };
    PlatformService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], PlatformService);
    return PlatformService;
}());
exports.PlatformService = PlatformService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBsYXRmb3JtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsc0NBQXdEO0FBRXhELGtEQUFpRDtBQUdqRDtJQUNJLHlCQUE2QixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFHLENBQUM7SUFFM0Msa0JBQWtCO0lBQ2xCLHFEQUFxRDtJQUM5QyxnREFBc0IsR0FBN0I7UUFBQSxpQkFjQztRQWJHLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBTTtnQkFDbEYsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwQyxJQUFJLHNCQUFzQixHQUF5QixFQUFFLENBQUM7Z0JBRXRELEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN6QyxJQUFJLGNBQWMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsNkJBQTZCLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMzRyxDQUFDO2dCQUVELE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0Qsa0JBQWtCO0lBQ2xCLHFDQUFxQztJQUM5QixnREFBc0IsR0FBN0I7UUFBQSxpQkFjQztRQWJHLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBTTtnQkFDbEUsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM1QixJQUFJLHNCQUFzQixHQUF5QixFQUFFLENBQUM7Z0JBRXRELEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNqQyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsNkJBQTZCLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hHLENBQUM7Z0JBRUQsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyx1REFBNkIsR0FBckMsVUFBc0MsVUFBa0IsRUFBRSxRQUFnQjtRQUN0RSxJQUFJLFlBQVksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLFlBQVksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUV6QyxNQUFNLENBQUMsSUFBSSw2QkFBYSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQTdDUSxlQUFlO1FBRDNCLGlCQUFVLEVBQUU7eUNBRTBCLFdBQUk7T0FEOUIsZUFBZSxDQStDM0I7SUFBRCxzQkFBQztDQUFBLEFBL0NELElBK0NDO0FBL0NZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcblxuaW1wb3J0IHsgQ3VycmVuY3lQcmljZSB9IGZyb20gXCIuLi9DdXJyZW5jeVByaWNlXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbGF0Zm9ybVNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaHR0cDogSHR0cCkge31cblxuICAgIC8vYml0c3RhbXAgc3ltYm9sc1xuICAgIC8vaHR0cHM6Ly93d3cuYml0c3RhbXAubmV0L2FwaS92Mi90cmFkaW5nLXBhaXJzLWluZm8vXG4gICAgcHVibGljIHJlYWRBbGxCaXRzdGFtcFN5bWJvbHMoKTogUHJvbWlzZTxDdXJyZW5jeVByaWNlW10+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL3d3dy5iaXRzdGFtcC5uZXQvYXBpL3YyL3RyYWRpbmctcGFpcnMtaW5mby9cIikuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYml0c3RhbXBTeW1ib2xzID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICBsZXQgYml0c3RhbXBDdXJyZW5jeVByaWNlczogQXJyYXk8Q3VycmVuY3lQcmljZT4gPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGJpdHN0YW1wU3ltYm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYml0c3RhbXBTeW1ib2wgPSBiaXRzdGFtcFN5bWJvbHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGJpdHN0YW1wQ3VycmVuY3lQcmljZXMucHVzaCh0aGlzLmNyZWF0ZUN1cnJlbmN5UHJpY2VGcm9tU3ltYm9sKGJpdHN0YW1wU3ltYm9sLnVybF9zeW1ib2wsIFwiYml0c3RhbXBcIikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc29sdmUoYml0c3RhbXBDdXJyZW5jeVByaWNlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvL2JpdGZpbmV4IHN5bWJvbHNcbiAgICAvL2h0dHBzOi8vYXBpLmJpdGZpbmV4LmNvbS92MS9zeW1ib2xzXG4gICAgcHVibGljIHJlYWRBbGxCaXRmaW5leFN5bWJvbHMoKTogUHJvbWlzZTxDdXJyZW5jeVByaWNlW10+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5nZXQoXCJodHRwczovL2FwaS5iaXRmaW5leC5jb20vdjEvc3ltYm9sc1wiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2xzID0gcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICBsZXQgYml0ZmluZXhDdXJyZW5jeVByaWNlczogQXJyYXk8Q3VycmVuY3lQcmljZT4gPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJpdGZpbmV4U3ltYm9sID0gc3ltYm9sc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYml0ZmluZXhDdXJyZW5jeVByaWNlcy5wdXNoKHRoaXMuY3JlYXRlQ3VycmVuY3lQcmljZUZyb21TeW1ib2woYml0ZmluZXhTeW1ib2wsIFwiYml0ZmluZXhcIikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc29sdmUoYml0ZmluZXhDdXJyZW5jeVByaWNlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDdXJyZW5jeVByaWNlRnJvbVN5bWJvbChzeW1ib2xQYWlyOiBzdHJpbmcsIHBsYXRmb3JtOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHNvdXJjZVN5bWJvbCA9IHN5bWJvbFBhaXIuc2xpY2UoMCwzKTtcbiAgICAgICAgbGV0IHRhcmdldFN5bWJvbCA9IHN5bWJvbFBhaXIuc2xpY2UoMyw2KTtcblxuICAgICAgICByZXR1cm4gbmV3IEN1cnJlbmN5UHJpY2Uoc291cmNlU3ltYm9sLCB0YXJnZXRTeW1ib2wsIHBsYXRmb3JtKTtcbiAgICB9XG5cbn0iXX0=