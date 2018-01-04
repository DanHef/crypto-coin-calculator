"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var calculation_service_1 = require("../services/calculation.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var CreateCalculationComponent = (function () {
    function CreateCalculationComponent(calculationService, router, routerExtension) {
        this.calculationService = calculationService;
        this.router = router;
        this.routerExtension = routerExtension;
    }
    CreateCalculationComponent.prototype.createCalculationResult = function () {
        this.calculationService.createCalculationResult(this.sourcePortfolioItemName.toLowerCase(), this.targetCurrencySymbol.toLowerCase(), this.description, this.platform.toLowerCase());
        this.routerExtension.navigate(["/items"], { clearHistory: true });
    };
    CreateCalculationComponent = __decorate([
        core_1.Component({
            selector: "create-calculation",
            moduleId: module.id,
            templateUrl: "./create-calculation.component.html",
        }),
        __metadata("design:paramtypes", [calculation_service_1.CalculationService,
            router_1.Router,
            router_2.RouterExtensions])
    ], CreateCalculationComponent);
    return CreateCalculationComponent;
}());
exports.CreateCalculationComponent = CreateCalculationComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWNhbGN1bGF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZS1jYWxjdWxhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFFbEQsdUVBQXFFO0FBRXJFLDBDQUF5QztBQUN6QyxzREFBK0Q7QUFPL0Q7SUFNSSxvQ0FBNkIsa0JBQXNDLEVBQ3RDLE1BQWMsRUFDZCxlQUFpQztRQUZqQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7SUFBSSxDQUFDO0lBRW5FLDREQUF1QixHQUF2QjtRQUNJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBRXBMLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBZFEsMEJBQTBCO1FBTHRDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUscUNBQXFDO1NBQ3JELENBQUM7eUNBT21ELHdDQUFrQjtZQUM5QixlQUFNO1lBQ0cseUJBQWdCO09BUnJELDBCQUEwQixDQWV0QztJQUFELGlDQUFDO0NBQUEsQUFmRCxJQWVDO0FBZlksZ0VBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG5pbXBvcnQgeyBDYWxjdWxhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvY2FsY3VsYXRpb24uc2VydmljZVwiO1xuXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJjcmVhdGUtY2FsY3VsYXRpb25cIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY3JlYXRlLWNhbGN1bGF0aW9uLmNvbXBvbmVudC5odG1sXCIsXG59KVxuZXhwb3J0IGNsYXNzIENyZWF0ZUNhbGN1bGF0aW9uQ29tcG9uZW50ICB7XG4gICAgc291cmNlUG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZztcbiAgICB0YXJnZXRDdXJyZW5jeVN5bWJvbDpzdHJpbmc7XG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICBwbGF0Zm9ybTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjYWxjdWxhdGlvblNlcnZpY2U6IENhbGN1bGF0aW9uU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyRXh0ZW5zaW9uOiBSb3V0ZXJFeHRlbnNpb25zKSB7IH1cblxuICAgIGNyZWF0ZUNhbGN1bGF0aW9uUmVzdWx0KCkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0aW9uU2VydmljZS5jcmVhdGVDYWxjdWxhdGlvblJlc3VsdCh0aGlzLnNvdXJjZVBvcnRmb2xpb0l0ZW1OYW1lLnRvTG93ZXJDYXNlKCksIHRoaXMudGFyZ2V0Q3VycmVuY3lTeW1ib2wudG9Mb3dlckNhc2UoKSwgdGhpcy5kZXNjcmlwdGlvbiwgdGhpcy5wbGF0Zm9ybS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9uLm5hdmlnYXRlKFtcIi9pdGVtc1wiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gICAgfVxufSJdfQ==