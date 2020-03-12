import { Component, OnInit } from '@angular/core';
import { HttpService } from '@app/core';
import { Constants } from '@app/utils';
import { Bin } from '@app/views/common/bin.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SampleData } from '@app/views/common/data.sample';

@Component({
  selector: 'app-full-map',
  templateUrl: './full-map.component.html',
  styleUrls: ['./full-map.component.scss']
})
export class FullMapComponent implements OnInit {

  binData: Bin[];
  zoom: number;
  latitude: number;
  longitude: number;

  constructor(private httpService: HttpService) {
    this.zoom = 12;
    this.latitude = 8.524139;
    this.longitude = 76.936638;
   }

  ngOnInit() {
    let municipality = "Test";
    this.getBinData(municipality);
  }

  getBinData(municipality) {
    let url = Constants.BIN_DATA_ENDPOINT + "?municipality=" + municipality;

    this.httpService.get(url).subscribe((response: HttpResponse<Bin[]>) => {
      this.binData = response.body;
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.binData = SampleData.binData;
    })
  }

}
