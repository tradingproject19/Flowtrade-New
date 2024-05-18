import { Component, NgZone } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["charts.component.scss"],
})
export class ChartsPageComponent {
  showMenu: boolean = false;
  logoClick() {
    this.ngZone.run(() => {
      document.body.classList.toggle("left-bar-enabled");
    });
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {}
  refreshPage() {
    const currentRoute = this.route.snapshot;
    const currentParams = { ...currentRoute.params };

    // Modify some parameter (you can use any logic to change the parameter)
    const newParamValue = "new-value";

    if (currentParams["id"] !== newParamValue) {
      // Update the parameter and navigate only if it has changed
      currentParams["id"] = newParamValue;

      // Navigate to the same route with the modified parameter
      this.router.navigate([
        currentRoute.routeConfig.path,
        { id: newParamValue },
      ]);
    }
  }

  async ngOnInit() {
    //this.refreshPage();
  }
}
