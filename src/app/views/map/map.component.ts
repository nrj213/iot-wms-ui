import { Component, OnInit } from "@angular/core";
import { Constants } from "@app/utils";

// just an interface for type safety.
interface marker {
  id: number;
  lat: number;
  lng: number;
  level: number;
  area: string;
  staffName: string;
  staffMobileNo: string;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  // google maps zoom level
  zoom: number = 16;

  // initial center position for the map
  lat: number = 8.431363;
  lng: number = 76.981965;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  // mapClicked($event: MouseEvent) {
  //   this.markers.push({
  //     lat: $event["coords"]["lat"],
  //     lng: $event["coords"]["lng"],
  //     draggable: true
  //   });
  // }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log("dragEnd", m, $event);
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

  markers: marker[] = [
    {
      id: 1,
      lat: 8.431363,
      lng: 76.981965,
      level: 91,
      area: "Kola",
      staffName: "Kumar",
      staffMobileNo: "8891906510",
      label: "",
      draggable: true
    },
    {
      id: 2,
      lat: 8.431363,
      lng: 76.983965,
      level: 30,
      area: "Kola",
      staffName: "Kumar",
      staffMobileNo: "8891906510",
      label: "",
      draggable: false
    },
    {
      id: 3,
      lat: 8.431363,
      lng: 76.987965,
      level: 60,
      area: "Kola",
      staffName: "Kumar",
      staffMobileNo: "8891906510",
      label: "",
      draggable: true
    }
  ];
}
