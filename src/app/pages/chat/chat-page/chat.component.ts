import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  public safeURL: SafeResourceUrl;
  constructor(private _sanitizer: DomSanitizer) {
  this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://discord.com/widget?id=471521558989504531&theme=dark');
  }
}
