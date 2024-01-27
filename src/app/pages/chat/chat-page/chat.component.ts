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
  this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://emerald.widgetbot.io/channels/471521558989504531/472119292427501568');
  }
}
// <iframe src="https://emerald.widgetbot.io/channels/299881420891881473/355719584830980096" height="600" width="800"></iframe>
