import { Component, OnInit, Input } from "@angular/core";
import { Constants } from "@app/utils";
import { Bin } from '../../models/bin.model';
import { DataService, HttpService } from '@app/core';
import { User } from '../../models/user.model';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CollectionHistoryModalComponent } from '../../../home/collection-history-modal/collection-history-modal.component';
import { StaffDetailModalComponent } from '@app/views/home/staff-detail-modal/staff-detail-modal.component';

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  // Dustbin data to be shown on map
  @Input('binData') markers: Bin[];

  // google maps zoom level
  @Input() zoom: number;

  // initial center position for the map
  @Input('latitude') lat: number;
  @Input('longitude') lng: number;

  currentUser: User;

  // origin = { lat: 8.431363, lng: 76.981965 }
  // destination = { lat: 8.498531, lng: 76.957246 }
  // waypoints = [
  //    {location: { lat: 8.562943, lng: 76.875893 }},
  //    {location: { lat: 8.561774, lng: 76.943420 }}
  // ]

  constructor(private httpService: HttpService, private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit() {
    this.currentUser = this.dataService.currentUserDetailsSubject.getValue();
  }

  // clickedMarker(label: string, index: number) {
  //   console.log(`clicked the marker: ${label || index}`);
  // }

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

  markAsCollected(binId: number, staffId: number, currentLevel: number) {
    if (currentLevel !== 0) {
      if (confirm("Are you sure you want to proceed?")) {
        let url = Constants.BIN_ENDPOINT + "/collected";
        let body = {
          "bin-id": binId,
          "staff-id": staffId
        };

        this.httpService.put(url, body).subscribe((response: any) => {
          if (!isNullOrUndefined(response.code) && response.code == 0) {
            if (response.data > 0) {
              this.markers.map((marker) => {
                if (marker.id == binId) {
                  marker.level = 0;
                }
              });
              alert("Update successful")
            } else {
              alert("Update failed!")
            }
          } else {
            alert(response.code + " : " + response.message);
          }
        }, (error: HttpErrorResponse) => {
          console.log(error);
        });
      }
    } else {
      alert("Bin already empty!")
    }
  }

  showCollectionHistory(binId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = binId;
    dialogConfig.width = '500px';

    this.dialog.open(CollectionHistoryModalComponent, dialogConfig);
  }

  showStaffDetails(staffId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      staffId,
      modalTitle: "Staff Details"
    }
    dialogConfig.width = '350px';

    this.dialog.open(StaffDetailModalComponent, dialogConfig);
  }

}