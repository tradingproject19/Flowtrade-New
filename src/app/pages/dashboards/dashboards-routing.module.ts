import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DefaultComponent } from "./default/default.component";
import { ClassicComponent } from "../classic/classic.component";
import { DarkPoolComponent } from "../dark-pool/dark-pool.component";
import { CryptoComponent } from "../crypto/crypto.component";
import { ScannerComponent } from "../scanner/scanner.component";
import { FtDiverganceComponent } from "../ft-divergance/ft-divergance.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent
  },
  {
    path: "dark-pool",
    component: DarkPoolComponent
  },
  {
    path: 'crypto',
    component: CryptoComponent
  },
  {
    path:'scanner',
    component: ScannerComponent
  },
  {
    path: 'ft-divergance',
    component: FtDiverganceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
