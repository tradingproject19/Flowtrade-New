import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent {
  public safeURL: SafeResourceUrl;
  constructor(private _sanitizer: DomSanitizer) {
  this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://flowtradeoptions-licxanqmtq-uc.a.run.app/');
  }
}
