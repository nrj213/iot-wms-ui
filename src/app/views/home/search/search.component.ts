import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Bin } from '@app/views/common/models/bin.model';
import { Constants } from '@app/utils';
import { HttpService, DataService } from '@app/core';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { getCenter } from 'geolib';

@Component({
  selector: 'app-search-table',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  binData: Bin[] = [];
  selectedData: Bin[] = [];
  zoom: number;
  centralLatitude: number;
  centralLongitude: number;

  roleId: number;
  areaSelection: number;
  municipalitySelection: number;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Bin>(this.binData);
  selection = new SelectionModel<Bin>(true, []);

  showTableView: boolean;
  showMapView: boolean;

  constructor(private httpService: HttpService, private dataService: DataService) {
    this.showTableView = true;
    this.showMapView = false;
  }

  ngOnInit() {
    this.roleId = this.dataService.currentUserDetailsSubject.getValue().roleId;

    let municipalityId = this.dataService.currentUserDetailsSubject.getValue().municipalityId;
    let areaId = this.dataService.currentUserDetailsSubject.getValue().areaId;

    if (municipalityId) {
      this.municipalitySelection = municipalityId;
    }

    if (areaId) {
      this.areaSelection = areaId;
    }

    this.getBinData(this.roleId, this.municipalitySelection, this.areaSelection)
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Bin): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  getBinData(roleId: number, municipalityId: number, areaId: number) {
    let url;
    switch (roleId) {
      case 1: {
        url = Constants.BIN_ENDPOINT;
        this.displayedColumns = ['select', 'id', 'municipality', 'area', 'latitude', 'longitude', 'level', 'staffName', 'staffMobileNo'];
        this.zoom = 8;
      } break;
      case 2: {
        url = Constants.BIN_ENDPOINT + "/" + municipalityId;
        this.displayedColumns = ['select', 'id', 'area', 'latitude', 'longitude', 'level', 'staffName', 'staffMobileNo'];
        this.zoom = 12;
      } break;
      case 3: {
        url = Constants.BIN_ENDPOINT + "/" + municipalityId + "/" + areaId;
        this.displayedColumns = ['select', 'id', 'latitude', 'longitude', 'level'];
        this.zoom = 15;
      } break;
    }

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        if (response.data.length) {
          this.binData = response.data;
          this.dataSource = new MatTableDataSource<Bin>(this.binData);
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

  showInMap() {
    let selectedBins = this.selection["_selected"];

    if (selectedBins.length) {
      this.toggleView();
      
      this.selectedData = selectedBins;

      let centralCoordinates = getCenter(selectedBins);

      this.centralLatitude = centralCoordinates['latitude'];
      this.centralLongitude = centralCoordinates['longitude'];
    } else {
      alert("Select atleast one bin!")
    }
  }

  toggleView() {
    this.showMapView = !this.showMapView;
    this.showTableView = !this.showTableView;
  }
}
