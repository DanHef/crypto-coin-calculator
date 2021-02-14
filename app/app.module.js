"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var app_routing_1 = require("./app.routing");
var app_component_1 = require("./app.component");
var item_service_1 = require("./item/item.service");
var portfolio_item_service_1 = require("./item/services/portfolio-item.service");
var items_component_1 = require("./item/items.component");
var create_portfolio_item_component_1 = require("./item/create-portfolio-item/create-portfolio-item.component");
var create_currency_price_component_1 = require("./item/create-currency-price/create-currency-price.component");
var create_calculation_component_1 = require("./item/create-calculation/create-calculation.component");
var currency_price_service_1 = require("./item/services/currency-price.service");
var calculation_service_1 = require("./item/services/calculation.service");
var platform_service_1 = require("./item/services/platform.service");
var angular_1 = require("nativescript-drop-down/angular");
// Uncomment and add to NgModule imports if you need to use two-way binding
var forms_1 = require("nativescript-angular/forms");
// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
var http_1 = require("nativescript-angular/http");
var core_2 = require("@ngx-translate/core");
var angular_2 = require("nativescript-ui-listview/angular");
/*export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, '/./i18n', '.json');
}*/
var AppModule = /** @class */ (function () {
    /*
    Pass your application module to the bootstrapModule function located in main.ts to start your app
    */
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent
            ],
            imports: [
                nativescript_module_1.NativeScriptModule,
                app_routing_1.AppRoutingModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule,
                angular_1.DropDownModule,
                angular_2.NativeScriptUIListViewModule,
                core_2.TranslateModule.forRoot()
            ],
            declarations: [
                app_component_1.AppComponent,
                items_component_1.ItemsComponent,
                create_portfolio_item_component_1.CreatePortfolioItemComponent,
                create_currency_price_component_1.CreateCurrencyPriceComponent,
                create_calculation_component_1.CreateCalculationComponent
            ],
            providers: [
                item_service_1.ItemService,
                portfolio_item_service_1.PortfolioItemService,
                currency_price_service_1.CurrencyPriceService,
                calculation_service_1.CalculationService,
                platform_service_1.PlatformService
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ],
            entryComponents: []
        })
        /*
        Pass your application module to the bootstrapModule function located in main.ts to start your app
        */
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLDZDQUFpRDtBQUNqRCxpREFBK0M7QUFFL0Msb0RBQWtEO0FBQ2xELGlGQUE4RTtBQUM5RSwwREFBd0Q7QUFDeEQsZ0hBQTRHO0FBQzVHLGdIQUE0RztBQUM1Ryx1R0FBb0c7QUFDcEcsaUZBQThFO0FBQzlFLDJFQUF5RTtBQUN6RSxxRUFBbUU7QUFFbkUsMERBQWdFO0FBTWhFLDJFQUEyRTtBQUMzRSxvREFBcUU7QUFFckUsNkVBQTZFO0FBQzdFLGtEQUFtRTtBQUduRSw0Q0FBc0Q7QUFFdEQsNERBQWdGO0FBRWhGOztHQUVHO0FBcUNIO0lBSEE7O01BRUU7SUFDRjtJQUF5QixDQUFDO0lBQWIsU0FBUztRQW5DckIsZUFBUSxDQUFDO1lBQ04sU0FBUyxFQUFFO2dCQUNQLDRCQUFZO2FBQ2Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsd0NBQWtCO2dCQUNsQiw4QkFBZ0I7Z0JBQ2hCLCtCQUF1QjtnQkFDdkIsNkJBQXNCO2dCQUN0Qix3QkFBYztnQkFDZCxzQ0FBNEI7Z0JBQzVCLHNCQUFlLENBQUMsT0FBTyxFQUFFO2FBQzVCO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLDRCQUFZO2dCQUNaLGdDQUFjO2dCQUNkLDhEQUE0QjtnQkFDNUIsOERBQTRCO2dCQUM1Qix5REFBMEI7YUFDN0I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsMEJBQVc7Z0JBQ1gsNkNBQW9CO2dCQUNwQiw2Q0FBb0I7Z0JBQ3BCLHdDQUFrQjtnQkFDbEIsa0NBQWU7YUFDbEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsdUJBQWdCO2FBQ25CO1lBQ0QsZUFBZSxFQUFFLEVBQUU7U0FDdEIsQ0FBQztRQUNGOztVQUVFO09BQ1csU0FBUyxDQUFJO0lBQUQsZ0JBQUM7Q0FBQSxBQUExQixJQUEwQjtBQUFiLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IEFwcFJvdXRpbmdNb2R1bGUgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vaXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQb3J0Zm9saW9JdGVtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vc2VydmljZXMvcG9ydGZvbGlvLWl0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgSXRlbXNDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2l0ZW1zLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ3JlYXRlUG9ydGZvbGlvSXRlbUNvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vY3JlYXRlLXBvcnRmb2xpby1pdGVtL2NyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnRcIjtcbmltcG9ydCB7IENyZWF0ZUN1cnJlbmN5UHJpY2VDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2NyZWF0ZS1jdXJyZW5jeS1wcmljZS9jcmVhdGUtY3VycmVuY3ktcHJpY2UuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDcmVhdGVDYWxjdWxhdGlvbkNvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vY3JlYXRlLWNhbGN1bGF0aW9uL2NyZWF0ZS1jYWxjdWxhdGlvbi5jb21wb25lbnRcIjtcbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS9zZXJ2aWNlcy9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDYWxjdWxhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtL3NlcnZpY2VzL2NhbGN1bGF0aW9uLnNlcnZpY2VcIjtcbmltcG9ydCB7IFBsYXRmb3JtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vc2VydmljZXMvcGxhdGZvcm0uc2VydmljZVwiO1xuXG5pbXBvcnQgeyBEcm9wRG93bk1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duL2FuZ3VsYXJcIjtcblxuaW1wb3J0ICogYXMgZWxlbWVudFJlZ2lzdHJ5TW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuXG5pbXBvcnQgKiBhcyBwbGF0Zm9ybU1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuXG4vLyBVbmNvbW1lbnQgYW5kIGFkZCB0byBOZ01vZHVsZSBpbXBvcnRzIGlmIHlvdSBuZWVkIHRvIHVzZSB0d28td2F5IGJpbmRpbmdcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5cbi8vIFVuY29tbWVudCBhbmQgYWRkIHRvIE5nTW9kdWxlIGltcG9ydHMgIGlmIHlvdSBuZWVkIHRvIHVzZSB0aGUgSFRUUCB3cmFwcGVyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcblxuaW1wb3J0IHsgSHR0cCB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcblxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlMaXN0Vmlld01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdWktbGlzdHZpZXcvYW5ndWxhclwiO1xuXG4vKmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cCkge1xuICAgIHJldHVybiBuZXcgVHJhbnNsYXRlU3RhdGljTG9hZGVyKGh0dHAsICcvLi9pMThuJywgJy5qc29uJyk7XG59Ki9cblxuQE5nTW9kdWxlKHtcbiAgICBib290c3RyYXA6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICAgICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgICAgIERyb3BEb3duTW9kdWxlLFxuICAgICAgICBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlLFxuICAgICAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCgpXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50LFxuICAgICAgICBJdGVtc0NvbXBvbmVudCxcbiAgICAgICAgQ3JlYXRlUG9ydGZvbGlvSXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ3JlYXRlQ3VycmVuY3lQcmljZUNvbXBvbmVudCxcbiAgICAgICAgQ3JlYXRlQ2FsY3VsYXRpb25Db21wb25lbnRcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBJdGVtU2VydmljZSxcbiAgICAgICAgUG9ydGZvbGlvSXRlbVNlcnZpY2UsXG4gICAgICAgIEN1cnJlbmN5UHJpY2VTZXJ2aWNlLFxuICAgICAgICBDYWxjdWxhdGlvblNlcnZpY2UsXG4gICAgICAgIFBsYXRmb3JtU2VydmljZVxuICAgIF0sXG4gICAgc2NoZW1hczogW1xuICAgICAgICBOT19FUlJPUlNfU0NIRU1BXG4gICAgXSxcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtdXG59KVxuLypcblBhc3MgeW91ciBhcHBsaWNhdGlvbiBtb2R1bGUgdG8gdGhlIGJvb3RzdHJhcE1vZHVsZSBmdW5jdGlvbiBsb2NhdGVkIGluIG1haW4udHMgdG8gc3RhcnQgeW91ciBhcHBcbiovXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuIl19