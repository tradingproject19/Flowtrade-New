import { Component , OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  ngOnInit() {
    // document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
    const node = document.createElement('script');
    node.src = 'https://api.webbotify.com/chat/2321411012211004518910216.js'
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
