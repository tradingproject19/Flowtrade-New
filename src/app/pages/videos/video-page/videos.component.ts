import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent {
  public safeURL: SafeResourceUrl;
  constructor(private _sanitizer: DomSanitizer) {
  this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/QdJn2wh8kf0?si=H2mW9Mzz1egggvLb');
  }
}
