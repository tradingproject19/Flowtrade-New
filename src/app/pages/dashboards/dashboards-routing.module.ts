import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DefaultComponent } from "./default/default.component";
import { ClassicComponent } from "../classic/classic.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent
  },
  // {
  //   path: "classic",
  //   component: ClassicComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
