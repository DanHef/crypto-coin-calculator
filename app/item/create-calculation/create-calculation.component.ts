import { Component, OnInit } from "@angular/core";

import { CalculationService } from "../services/calculation.service";

import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "create-calculation",
    moduleId: module.id,
    templateUrl: "./create-calculation.component.html",
})
export class CreateCalculationComponent  {
    sourcePortfolioItemName: string;
    targetCurrencySymbol:string;
    description: string;
    platform: string;

    constructor(private readonly calculationService: CalculationService,
                private readonly router: Router,
                private readonly routerExtension: RouterExtensions) { }

    createCalculationResult() {
        this.calculationService.createCalculationResult(this.sourcePortfolioItemName.toLowerCase(), this.targetCurrencySymbol.toLowerCase(), this.description, this.platform.toLowerCase());
        
        this.routerExtension.navigate(["/items"], { clearHistory: true });
    }
}