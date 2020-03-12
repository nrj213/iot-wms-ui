import { Component, OnInit, Input } from "@angular/core";
import { Constants } from "@app/utils";
import { Bin } from '../common/bin.model';

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

  // Dustbin data to be shown on map
  @Input('binData') markers: Bin[];

  // google maps zoom level
  @Input() zoom: number;

  // initial center position for the map
  @Input('latitude') lat: number;
  @Input('longitude') lng: number;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  buildIconUrl(status: number) {
    const baseUrl: string = Constants.IMG_BASE_URL;

    if (status > Constants.MEDIUM_THRESHOLD) {
      return baseUrl + "/bin/bin-high.png";
    }

    if (status > Constants.LOW_THRESHOLD) {
      return baseUrl + "/bin/bin-medium.png";
    }

    return baseUrl + "/bin/bin-low.png";
  }
}
