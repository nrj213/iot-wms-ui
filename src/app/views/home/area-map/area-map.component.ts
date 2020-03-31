import { Component, OnInit } from '@angular/core';
import { Bin } from '@app/views/common/models/bin.model';
import { HttpService } from '@app/core';
import { Constants } from '@app/utils';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { getCenter } from 'geolib';
import { Area } from '@app/views/common/models/area.model';

@Component({
  selector: 'app-area-map',
  templateUrl: './area-map.component.html',
  styleUrls: ['./area-map.component.scss']
})
export class AreaMapComponent implements OnInit {

  binData: Bin[];
  zoom: number;
  centralLatitude: number;
  centralLongitude: number;

  areaList: Area[];
  areaSelection: number;
  municipalitySelection: number;

  constructor(private httpService: HttpService) {
    this.zoom = 15;
  }

  ngOnInit() {
    this.municipalitySelection = 1;
    this.areaSelection = 1;

    this.getAreaData(this.municipalitySelection);
    this.getBinData(this.municipalitySelection, this.areaSelection)
  }

  getBinData(municipalityId: number, areaId: number) {
    let url = Constants.BIN_ENDPOINT + "/" + municipalityId + "/" + areaId;

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

  getAreaData(municipalityId) {
    let url = Constants.AREA_ENDPOINT + "/" + municipalityId;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.areaList = response.data;
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  onAreaChange() {
    if (!isNaN(this.areaSelection)) {
      this.getBinData(this.municipalitySelection, this.areaSelection)
    }
  }

}
