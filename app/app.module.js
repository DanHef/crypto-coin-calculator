"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var app_routing_1 = require("./app.routing");
var app_component_1 = require("./app.component");
var item_service_1 = require("./item/item.service");
var portfolio_item_service_1 = require("./item/services/portfolio-item.service");
var items_component_1 = require("./item/items.component");
var item_detail_component_1 = require("./item/item-detail.component");
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
var http_2 = require("@angular/http");
var ng2_translate_1 = require("ng2-translate");
function createTranslateLoader(http) {
    return new ng2_translate_1.TranslateStaticLoader(http, '/./i18n', '.json');
}
exports.createTranslateLoader = createTranslateLoader;
var AppModule = (function () {
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
                ng2_translate_1.TranslateModule.forRoot({
                    provide: ng2_translate_1.TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [http_2.Http]
                })
            ],
            declarations: [
                app_component_1.AppComponent,
                items_component_1.ItemsComponent,
                item_detail_component_1.ItemDetailComponent,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLDZDQUFpRDtBQUNqRCxpREFBK0M7QUFFL0Msb0RBQWtEO0FBQ2xELGlGQUE4RTtBQUM5RSwwREFBd0Q7QUFDeEQsc0VBQW1FO0FBQ25FLGdIQUE0RztBQUM1RyxnSEFBNEc7QUFDNUcsdUdBQW9HO0FBQ3BHLGlGQUE4RTtBQUM5RSwyRUFBeUU7QUFDekUscUVBQW1FO0FBRW5FLDBEQUFnRTtBQU9oRSwyRUFBMkU7QUFDM0Usb0RBQXFFO0FBRXJFLDZFQUE2RTtBQUM3RSxrREFBbUU7QUFFbkUsc0NBQXFDO0FBQ3JDLCtDQUEwRztBQUUxRywrQkFBc0MsSUFBVTtJQUM1QyxNQUFNLENBQUMsSUFBSSxxQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFGRCxzREFFQztBQXlDRDtJQUhBOztNQUVFO0lBQ0Y7SUFBeUIsQ0FBQztJQUFiLFNBQVM7UUF2Q3JCLGVBQVEsQ0FBQztZQUNOLFNBQVMsRUFBRTtnQkFDUCw0QkFBWTthQUNmO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLHdDQUFrQjtnQkFDbEIsOEJBQWdCO2dCQUNoQiwrQkFBdUI7Z0JBQ3ZCLDZCQUFzQjtnQkFDdEIsd0JBQWM7Z0JBQ2QsK0JBQWUsQ0FBQyxPQUFPLENBQUM7b0JBQ3BCLE9BQU8sRUFBRSwrQkFBZTtvQkFDeEIsVUFBVSxFQUFFLENBQUMscUJBQXFCLENBQUM7b0JBQ25DLElBQUksRUFBRSxDQUFDLFdBQUksQ0FBQztpQkFDZixDQUFDO2FBQ0w7WUFDRCxZQUFZLEVBQUU7Z0JBQ1YsNEJBQVk7Z0JBQ1osZ0NBQWM7Z0JBQ2QsMkNBQW1CO2dCQUNuQiw4REFBNEI7Z0JBQzVCLDhEQUE0QjtnQkFDNUIseURBQTBCO2FBQzdCO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLDBCQUFXO2dCQUNYLDZDQUFvQjtnQkFDcEIsNkNBQW9CO2dCQUNwQix3Q0FBa0I7Z0JBQ2xCLGtDQUFlO2FBQ2xCO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLHVCQUFnQjthQUNuQjtZQUNELGVBQWUsRUFBRSxFQUFFO1NBQ3RCLENBQUM7UUFDRjs7VUFFRTtPQUNXLFNBQVMsQ0FBSTtJQUFELGdCQUFDO0NBQUEsQUFBMUIsSUFBMEI7QUFBYiw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBBcHBSb3V0aW5nTW9kdWxlIH0gZnJvbSBcIi4vYXBwLnJvdXRpbmdcIjtcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gXCIuL2FwcC5jb21wb25lbnRcIjtcblxuaW1wb3J0IHsgSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtL2l0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgUG9ydGZvbGlvSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtL3NlcnZpY2VzL3BvcnRmb2xpby1pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IEl0ZW1zQ29tcG9uZW50IH0gZnJvbSBcIi4vaXRlbS9pdGVtcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IEl0ZW1EZXRhaWxDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2l0ZW0tZGV0YWlsLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ3JlYXRlUG9ydGZvbGlvSXRlbUNvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vY3JlYXRlLXBvcnRmb2xpby1pdGVtL2NyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnRcIjtcbmltcG9ydCB7IENyZWF0ZUN1cnJlbmN5UHJpY2VDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2NyZWF0ZS1jdXJyZW5jeS1wcmljZS9jcmVhdGUtY3VycmVuY3ktcHJpY2UuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDcmVhdGVDYWxjdWxhdGlvbkNvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vY3JlYXRlLWNhbGN1bGF0aW9uL2NyZWF0ZS1jYWxjdWxhdGlvbi5jb21wb25lbnRcIjtcbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS9zZXJ2aWNlcy9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDYWxjdWxhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtL3NlcnZpY2VzL2NhbGN1bGF0aW9uLnNlcnZpY2VcIjtcbmltcG9ydCB7IFBsYXRmb3JtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vc2VydmljZXMvcGxhdGZvcm0uc2VydmljZVwiO1xuXG5pbXBvcnQgeyBEcm9wRG93bk1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duL2FuZ3VsYXJcIjtcblxuaW1wb3J0ICogYXMgZWxlbWVudFJlZ2lzdHJ5TW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuaW1wb3J0ICogYXMgQWRtb2IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1hZG1vYlwiO1xuXG5pbXBvcnQgKiBhcyBwbGF0Zm9ybU1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuXG4vLyBVbmNvbW1lbnQgYW5kIGFkZCB0byBOZ01vZHVsZSBpbXBvcnRzIGlmIHlvdSBuZWVkIHRvIHVzZSB0d28td2F5IGJpbmRpbmdcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5cbi8vIFVuY29tbWVudCBhbmQgYWRkIHRvIE5nTW9kdWxlIGltcG9ydHMgIGlmIHlvdSBuZWVkIHRvIHVzZSB0aGUgSFRUUCB3cmFwcGVyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcblxuaW1wb3J0IHsgSHR0cCB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUsIFRyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlU3RhdGljTG9hZGVyLCBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwKSB7XG4gICAgcmV0dXJuIG5ldyBUcmFuc2xhdGVTdGF0aWNMb2FkZXIoaHR0cCwgJy8uL2kxOG4nLCAnLmpzb24nKTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgICBib290c3RyYXA6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICAgICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgICAgIERyb3BEb3duTW9kdWxlLFxuICAgICAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XG4gICAgICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXG4gICAgICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcbiAgICAgICAgICAgIGRlcHM6IFtIdHRwXVxuICAgICAgICB9KVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIEFwcENvbXBvbmVudCxcbiAgICAgICAgSXRlbXNDb21wb25lbnQsXG4gICAgICAgIEl0ZW1EZXRhaWxDb21wb25lbnQsXG4gICAgICAgIENyZWF0ZVBvcnRmb2xpb0l0ZW1Db21wb25lbnQsXG4gICAgICAgIENyZWF0ZUN1cnJlbmN5UHJpY2VDb21wb25lbnQsXG4gICAgICAgIENyZWF0ZUNhbGN1bGF0aW9uQ29tcG9uZW50XG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgSXRlbVNlcnZpY2UsXG4gICAgICAgIFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICBDdXJyZW5jeVByaWNlU2VydmljZSxcbiAgICAgICAgQ2FsY3VsYXRpb25TZXJ2aWNlLFxuICAgICAgICBQbGF0Zm9ybVNlcnZpY2VcbiAgICBdLFxuICAgIHNjaGVtYXM6IFtcbiAgICAgICAgTk9fRVJST1JTX1NDSEVNQVxuICAgIF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbXVxufSlcbi8qXG5QYXNzIHlvdXIgYXBwbGljYXRpb24gbW9kdWxlIHRvIHRoZSBib290c3RyYXBNb2R1bGUgZnVuY3Rpb24gbG9jYXRlZCBpbiBtYWluLnRzIHRvIHN0YXJ0IHlvdXIgYXBwXG4qL1xuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cbiJdfQ==