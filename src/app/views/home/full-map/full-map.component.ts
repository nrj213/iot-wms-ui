import { Component, OnInit } from '@angular/core';
import { HttpService } from '@app/core';
import { Constants } from '@app/utils';
import { Bin } from '@app/views/common/models/bin.model';
import { HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { getCenter } from 'geolib';
import { Municipality } from '@app/views/common/models/municipality.model';

@Component({
  selector: 'app-full-map',
  templateUrl: './full-map.component.html',
  styleUrls: ['./full-map.component.scss']
})
export class FullMapComponent implements OnInit {
  binData: Bin[];
  zoom: number;
  centralLatitude: number;
  centralLongitude: number;

  constructor(private httpService: HttpService) {
    this.zoom = 8;
  }

  ngOnInit() {
    this.getBinData();
  }

  getBinData() {
    let url = Constants.BIN_ENDPOINT;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.binData = response.data;

        if (response.data.length) {
          let centralCoordinates = getCenter(response.data);

          this.centralLatitude = centralCoordinates['latitude'];
          this.centralLongitude = centralCoordinates['longitude'];
        } else {
          alert("No data available!")
        }
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

}
