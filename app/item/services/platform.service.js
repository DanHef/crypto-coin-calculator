"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var CurrencyPrice_1 = require("../CurrencyPrice");
var PlatformService = /** @class */ (function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBsYXRmb3JtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsc0NBQXdEO0FBRXhELGtEQUFpRDtBQUdqRDtJQUNJLHlCQUE2QixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFHLENBQUM7SUFFM0Msa0JBQWtCO0lBQ2xCLHFEQUFxRDtJQUM5QyxnREFBc0IsR0FBN0I7UUFBQSxpQkFjQztRQWJHLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxREFBcUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLE1BQU07Z0JBQ2xGLElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxzQkFBc0IsR0FBeUIsRUFBRSxDQUFDO2dCQUV0RCxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDeEMsSUFBSSxjQUFjLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLDZCQUE2QixDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztpQkFDMUc7Z0JBRUQsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxrQkFBa0I7SUFDbEIscUNBQXFDO0lBQzlCLGdEQUFzQixHQUE3QjtRQUFBLGlCQWNDO1FBYkcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBTTtnQkFDbEUsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM1QixJQUFJLHNCQUFzQixHQUF5QixFQUFFLENBQUM7Z0JBRXRELEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNoQyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsNkJBQTZCLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7aUJBQy9GO2dCQUVELE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sdURBQTZCLEdBQXJDLFVBQXNDLFVBQWtCLEVBQUUsUUFBZ0I7UUFDdEUsSUFBSSxZQUFZLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxZQUFZLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekMsT0FBTyxJQUFJLDZCQUFhLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBN0NRLGVBQWU7UUFEM0IsaUJBQVUsRUFBRTt5Q0FFMEIsV0FBSTtPQUQ5QixlQUFlLENBK0MzQjtJQUFELHNCQUFDO0NBQUEsQUEvQ0QsSUErQ0M7QUEvQ1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlIH0gZnJvbSBcIi4uL0N1cnJlbmN5UHJpY2VcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBodHRwOiBIdHRwKSB7fVxuXG4gICAgLy9iaXRzdGFtcCBzeW1ib2xzXG4gICAgLy9odHRwczovL3d3dy5iaXRzdGFtcC5uZXQvYXBpL3YyL3RyYWRpbmctcGFpcnMtaW5mby9cbiAgICBwdWJsaWMgcmVhZEFsbEJpdHN0YW1wU3ltYm9scygpOiBQcm9taXNlPEN1cnJlbmN5UHJpY2VbXT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldChcImh0dHBzOi8vd3d3LmJpdHN0YW1wLm5ldC9hcGkvdjIvdHJhZGluZy1wYWlycy1pbmZvL1wiKS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBiaXRzdGFtcFN5bWJvbHMgPSByZXN1bHQuanNvbigpO1xuICAgICAgICAgICAgICAgIGxldCBiaXRzdGFtcEN1cnJlbmN5UHJpY2VzOiBBcnJheTxDdXJyZW5jeVByaWNlPiA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8Yml0c3RhbXBTeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBiaXRzdGFtcFN5bWJvbCA9IGJpdHN0YW1wU3ltYm9sc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYml0c3RhbXBDdXJyZW5jeVByaWNlcy5wdXNoKHRoaXMuY3JlYXRlQ3VycmVuY3lQcmljZUZyb21TeW1ib2woYml0c3RhbXBTeW1ib2wudXJsX3N5bWJvbCwgXCJiaXRzdGFtcFwiKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShiaXRzdGFtcEN1cnJlbmN5UHJpY2VzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vYml0ZmluZXggc3ltYm9sc1xuICAgIC8vaHR0cHM6Ly9hcGkuYml0ZmluZXguY29tL3YxL3N5bWJvbHNcbiAgICBwdWJsaWMgcmVhZEFsbEJpdGZpbmV4U3ltYm9scygpOiBQcm9taXNlPEN1cnJlbmN5UHJpY2VbXT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldChcImh0dHBzOi8vYXBpLmJpdGZpbmV4LmNvbS92MS9zeW1ib2xzXCIpLnN1YnNjcmliZSgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN5bWJvbHMgPSByZXN1bHQuanNvbigpO1xuICAgICAgICAgICAgICAgIGxldCBiaXRmaW5leEN1cnJlbmN5UHJpY2VzOiBBcnJheTxDdXJyZW5jeVByaWNlPiA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8c3ltYm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYml0ZmluZXhTeW1ib2wgPSBzeW1ib2xzW2ldO1xuICAgICAgICAgICAgICAgICAgICBiaXRmaW5leEN1cnJlbmN5UHJpY2VzLnB1c2godGhpcy5jcmVhdGVDdXJyZW5jeVByaWNlRnJvbVN5bWJvbChiaXRmaW5leFN5bWJvbCwgXCJiaXRmaW5leFwiKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShiaXRmaW5leEN1cnJlbmN5UHJpY2VzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUN1cnJlbmN5UHJpY2VGcm9tU3ltYm9sKHN5bWJvbFBhaXI6IHN0cmluZywgcGxhdGZvcm06IHN0cmluZykge1xuICAgICAgICBsZXQgc291cmNlU3ltYm9sID0gc3ltYm9sUGFpci5zbGljZSgwLDMpO1xuICAgICAgICBsZXQgdGFyZ2V0U3ltYm9sID0gc3ltYm9sUGFpci5zbGljZSgzLDYpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQ3VycmVuY3lQcmljZShzb3VyY2VTeW1ib2wsIHRhcmdldFN5bWJvbCwgcGxhdGZvcm0pO1xuICAgIH1cblxufSJdfQ==