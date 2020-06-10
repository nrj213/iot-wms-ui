import { Component, OnInit } from '@angular/core';
import { Bin } from '@app/views/common/models/bin.model';
import { HttpService, DataService } from '@app/core';
import { Constants } from '@app/utils';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { getCenter } from 'geolib';
import { Area } from '@app/views/common/models/area.model';
import { Municipality } from '@app/views/common/models/municipality.model';

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
  municipalityList: Municipality[];
  
  areaSelection: number;
  municipalitySelection: number;

  roleId: number;

  constructor(private httpService: HttpService, private dataService: DataService) {
    this.zoom = 15;
  }

  ngOnInit() {
    this.roleId = this.dataService.currentUserDetailsSubject.getValue().roleId;

    let municipalityId = this.dataService.currentUserDetailsSubject.getValue().municipalityId;
    let areaId = this.dataService.currentUserDetailsSubject.getValue().areaId;

    if (municipalityId) {
      this.municipalitySelection = municipalityId;
    }

    if(areaId) {
      this.areaSelection = areaId;
    }

    this.getMunicipalityData();
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

  getMunicipalityData() {
    let url = Constants.MUNICIPALITY_ENDPOINT;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.municipalityList = response.data;
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  onMunicipalityChange() {
    if (!isNaN(this.municipalitySelection)) {
      this.getAreaData(this.municipalitySelection);
    }
  }

}
