import { Component, OnInit } from '@angular/core';
import { HttpService, DataService } from '@app/core';
import { Constants } from '@app/utils';
import { Bin } from '@app/views/common/models/bin.model';
import { HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { getCenter } from 'geolib';
import { Municipality } from '@app/views/common/models/municipality.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-municipal-map',
  templateUrl: './municipal-map.component.html',
  styleUrls: ['./municipal-map.component.scss']
})
export class MunicipalMapComponent implements OnInit {
  binData: Bin[];
  zoom: number;
  centralLatitude: number;
  centralLongitude: number;

  municipalityList: Municipality[];
  municipalitySelection: number;

  roleId: number;

  constructor(private httpService: HttpService, private route: ActivatedRoute, private dataService: DataService) {
    this.zoom = 12;
  }

  ngOnInit() {
    this.roleId = this.dataService.currentUserDetailsSubject.getValue().roleId;

    let municipalityId = this.dataService.currentUserDetailsSubject.getValue().municipalityId;

    if (municipalityId) {
      this.municipalitySelection = municipalityId;
    }

    this.getMunicipalityData();
    this.getBinData(this.municipalitySelection);
  }

  getBinData(municipalityId: number) {
    let url = Constants.BIN_ENDPOINT + "/" + municipalityId;

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

  getMunicipalityData() {
    let url = Constants.MUNICIPALITY_ENDPOINT;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.municipalityList = response.data;
        if(!this.municipalityList.length) {
          alert("Municipality data not available!");
        }
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  onMunicipalityChange() {
    if (!isNaN(this.municipalitySelection)) {
      this.getBinData(this.municipalitySelection)
    }
  }

}
