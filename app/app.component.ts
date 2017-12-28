import { Component } from "@angular/core";
import * as Admob from "nativescript-admob";

import { registerElement } from "nativescript-angular/element-registry";
registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent {
    
 }
