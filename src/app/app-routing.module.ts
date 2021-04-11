import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { HomeComponent } from "./home/home.component";
import { CryptoPortfolioComponent } from "./crypto-portfolio/crypto-portfolio.component";

const routes: Routes = [
    { path: "", redirectTo: "/crypto-home", pathMatch: "full" },
    { path: "crypto-home", component: HomeComponent,
      children: [{
          path: "crypto-portfolio", component: CryptoPortfolioComponent
      }] }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
