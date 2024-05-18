import { Directive, ElementRef, OnInit } from "@angular/core";

@Directive({
  standalone: true,
  selector: "[iframeAutoHeight]",
})
export class IframeAutoHeightDirective implements OnInit {
  private el: HTMLIFrameElement;
  private prevHeight: number;
  private sameCount: number;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    const self = this;
    if (this.el.tagName === "IFRAME") {
      this.el.onload = () => {
        self.prevHeight = 0;
        self.sameCount = 0;
        setTimeout(() => {
          self.setHeight();
        }, 50);
      };
    }
  }

  setHeight() {
    const self = this;
    if (this.el.contentWindow?.document.body.scrollHeight !== this.prevHeight) {
      this.sameCount = 0;
      this.prevHeight = this.el.contentWindow.document.body.scrollHeight;
      self.el.style.height = this.prevHeight + "px";
      setTimeout(() => {
        self.setHeight();
      }, 50);
    } else {
      this.sameCount++;
      if (this.sameCount < 2) {
        setTimeout(() => {
          self.setHeight();
        }, 50);
      }
    }
  }
}
