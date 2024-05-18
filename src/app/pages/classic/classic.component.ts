import { Component, ElementRef, NgZone, Renderer2 } from "@angular/core";
import { IframeAutoHeightDirective } from "src/app/directives/iframe.auto.height.directive";
import { SafePipe } from "src/app/pipes/safe.pipe";
import { LayoutsModule } from "../../layouts/layouts.module";

@Component({
    selector: "app-classic",
    standalone: true,
    templateUrl: "./classic.component.html",
    styleUrl: "./classic.component.scss",
    imports: [SafePipe, IframeAutoHeightDirective, LayoutsModule]
})
export class ClassicComponent {
  constructor(private ngZone: NgZone, private renderer: Renderer2,private el: ElementRef) {
    let user = encodeURIComponent(localStorage.getItem("email"));
    let pass = encodeURIComponent(localStorage.getItem("password"));
    this.classWebUrl = `https://app.flowtrade.com/login?user=${user}&&pass=${pass}`;
  }
  public classWebUrl: string;

  toggleMenu() {
    this.ngZone.run(() => {
      document.body.classList.toggle("left-bar-enabled");
    });
  }

  ngOnInit(){
      // Get the viewport height
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      // Subtract 32px from the viewport height
      const iframeHeight = vh - 32;

      // Set the height of the iframe
      this.renderer.setStyle(this.el.nativeElement.querySelector('#myFrame'), 'height', `${iframeHeight}px`);
  }
}
