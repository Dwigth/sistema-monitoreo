import { Component, OnInit } from '@angular/core';

/**
 * Christmas
 */
import Snowfall from 'snowfall-animation'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    this.christmas();
  }

  christmas() {
    const configs = {
      element: '#canvas',   // required "canvas element" 
      number: 500,           // optional "snowflakes: 1-1000, default: 30"
      speed: 9,             // optional "speed: 1-10, default: 3"
      radius: 6,            // optional "radius: 1-10, default: 4",
      color: '#9dd8f5'
    }
    const snowfall = new Snowfall(configs)
    snowfall.init();
  }

}
