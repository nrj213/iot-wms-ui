import { Component, OnInit } from "@angular/core";

// just an interface for type safety.
interface marker {
  id: number;
  lat: number;
  lng: number;
  area: string;
  staffName: string;
  staffMobileNo: string;
  label?: string;
  draggable: boolean;
  iconUrl?: string;
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

  markers: marker[] = [
    {
      id: 1,
      lat: 8.431363,
      lng: 76.981965,
      area: "Kola",
      staffName: "Kumar",
      staffMobileNo: "8891906510",
      label: "",
      draggable: true,
      iconUrl: "/assets/images/bin/bin-low.png"
    },
    {
      id: 2,
      lat: 8.431363,
      lng: 76.983965,
      area: "Kola",
      staffName: "Kumar",
      staffMobileNo: "8891906510",
      label: "",
      draggable: false,
      iconUrl: "/assets/images/bin/bin-high.png"
    },
    {
      id: 3,
      lat: 8.431363,
      lng: 76.987965,
      area: "Kola",
      staffName: "Kumar",
      staffMobileNo: "8891906510",
      label: "",
      draggable: true,
      iconUrl: "/assets/images/bin/bin-medium.png"
    }
  ];
}
