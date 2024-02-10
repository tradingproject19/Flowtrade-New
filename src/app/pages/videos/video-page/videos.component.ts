import { Component, OnInit  } from '@angular/core';


@Component({
  selector: 'app-videos',
  // template: '<youtube-player videoId="dQw4w9WgXcQ"></youtube-player>',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideoComponent implements OnInit {
  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}
