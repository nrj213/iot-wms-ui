import { Component, OnInit, Inject } from '@angular/core';
import { Municipality } from '@app/views/common/models/municipality.model';
import { Area } from '@app/views/common/models/area.model';
import { Bin } from '@app/views/common/models/bin.model';
import { Staff } from '@app/views/common/models/staff.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpService } from '@app/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Constants } from '@app/utils';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss']
})
export class BinComponent implements OnInit {
  municipalityList: Municipality[];
  municipalitySelection: number;

  areaList: Area[];
  areaSelection: number;

  binList: Bin[];
  binSelection: number;

  staffList: Staff[];

  displayedColumns: string[] = ['select', 'id', 'latitude', 'longitude', 'level', 'staffName'];
  dataSource = new MatTableDataSource<Bin>(this.binList);
  selection = new SelectionModel<Bin>(true, []);

  constructor(private httpService: HttpService, private dialog: MatDialog, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getMunicipalityData();
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

  getMunicipalityData() {
    let url = Constants.MUNICIPALITY_ENDPOINT;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.municipalityList = response.data;
        if (!this.municipalityList.length) {
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
    this.selection.clear();
    
    if (!isNaN(this.municipalitySelection)) {
      this.getAreaData(this.municipalitySelection);
    }
  }

  getAreaData(municipalityId) {
    let url = Constants.AREA_ENDPOINT + "/" + municipalityId;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.areaList = response.data;
        if (!this.areaList.length) {
          alert("No area data under this municipality!");
        }
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  onAreaChange() {
    this.selection.clear();

    if (!isNaN(this.areaSelection)) {
      this.getBinData(this.municipalitySelection, this.areaSelection);
      this.getStaffData(this.areaSelection);
    }
  }

  getBinData(municipalityId, areaId) {
    let url = Constants.BIN_ENDPOINT + "/" + municipalityId + "/" + areaId;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.binList = response.data;
        this.dataSource = new MatTableDataSource<Bin>(this.binList);

        if (!this.binList.length) {
          alert("Bin data not available!");
        }
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  getStaffData(areaId) {
    let url = Constants.STAFF_DETAILS_ENDPOINT + "?areaId=" + areaId;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        let garbageCollectorsList = response.data.filter(item => {return (item.roleId==3 && item.statusId==1)})
        this.staffList = garbageCollectorsList;
        if (!this.staffList.length) {
          alert("No garbage collectors are present under this area!");
        }
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      "areaList": this.areaList,
      "areaSelection": this.areaSelection,
      "staffList": this.staffList,
    }
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(AddBinModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let url = Constants.BIN_ENDPOINT;
        let body = data;

        this.httpService.post(url, body).subscribe((response: any) => {
          if (!isNullOrUndefined(response.code) && response.code == 0) {
            if (response.data > 0) {
              alert("Added successfully");
              this.getBinData(this.municipalitySelection, this.areaSelection);
            } else {
              alert("Failed to add!");
            }
          } else {
            alert(response.code + " : " + response.message);
          }
        }, (error: HttpErrorResponse) => {
          console.log(error);
        });
      }
    });
  }

  edit() {
    let selected = this.selection["_selected"];

    if (selected.length) {
      if (selected.length == 1) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          "binDetails": selected[0],
          "areaList": this.areaList,
          "areaSelection": this.areaSelection,
          "staffList": this.staffList,
        }
        dialogConfig.width = '500px';

        const dialogRef = this.dialog.open(EditBinModalComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            let url = Constants.BIN_ENDPOINT;
            let body = data;

            this.httpService.put(url, body).subscribe((response: any) => {
              if (!isNullOrUndefined(response.code) && response.code == 0) {
                if (response.data > 0) {
                  alert("Edit successful");
                } else {
                  alert("Failed to edit!");
                }
                this.selection.clear();
                this.getBinData(this.municipalitySelection, this.areaSelection);
              } else {
                alert(response.code + " : " + response.message);
              }
            }, (error: HttpErrorResponse) => {
              console.log(error);
            });
          }
        });
      } else {
        alert("Select only one row at a time!");
      }
    } else {
      alert("Select a row first!")
    }
  }

  delete() {
    let selected = this.selection["_selected"];

    if (selected.length) {
      if (selected.length == 1) {
        if (confirm("Proceed with the deletion?")) {
          let binId = selected[0].id;
          let url = Constants.BIN_ENDPOINT + "?binId=" + binId;

          this.httpService.delete(url).subscribe((response: any) => {
            if (!isNullOrUndefined(response.code) && response.code == 0) {
              if (response.data > 0) {
                alert("Deleted successfully")
              } else {
                alert("Failed to delete!")
              }
              this.selection.clear();
              this.getBinData(this.municipalitySelection, this.areaSelection);
            } else {
              alert(response.code + " : " + response.message);
            }
          }, (error: HttpErrorResponse) => {
            console.log(error);
          });
        }
      } else {
        alert("Select only one row at a time!");
      }
    } else {
      alert("Select a row first!")
    }
  }

  modifyLevel() {
    let selected = this.selection["_selected"];
  
    if (selected.length) {
      if (selected.length == 1) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          "binDetails": selected[0],
          "areaList": this.areaList,
          "areaSelection": this.areaSelection,
          "staffList": this.staffList,
        }
        dialogConfig.width = '500px';
  
        const dialogRef = this.dialog.open(ModifyBinLevelModalComponent, dialogConfig);
  
        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            let url = Constants.BIN_ENDPOINT + "/level";
            let body = data;
  
            this.httpService.post(url, body).subscribe((response: any) => {
              if (!isNullOrUndefined(response.code) && response.code == 0) {
                if (response.data > 0) {
                  alert("Edit successful");
                } else {
                  alert("Failed to edit!");
                }
                this.selection.clear();
                this.getBinData(this.municipalitySelection, this.areaSelection);
              } else {
                alert(response.code + " : " + response.message);
              }
            }, (error: HttpErrorResponse) => {
              console.log(error);
            });
          }
        });
      } else {
        alert("Select only one row at a time!");
      }
    } else {
      alert("Select a row first!")
    }
  }
}

@Component({
  templateUrl: './add-modal.html',
  styleUrls: ['./add-modal.scss']
})
export class AddBinModalComponent {
  binItem: Bin = {
    municipality: '',
    area: '',
    latitude: null,
    longitude: null,
    level: null,
    staffId: null,
    staffName: '',
    staffMobileNo: ''
  }

  staffList: Staff[];

  areaList: Area[];

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.binItem.areaId = data.areaSelection;
    this.staffList = data.staffList;
    this.areaList = data.areaList;
  }
}

@Component({
  templateUrl: './edit-modal.html',
  styleUrls: ['./edit-modal.scss']
})
export class EditBinModalComponent {
  binItem: Bin;

  staffList: Staff[];

  areaList: Area[];

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.binItem = data.binDetails;
    this.binItem.areaId = data.areaSelection;
    this.staffList = data.staffList;
    this.areaList = data.areaList;
  }
}

@Component({
  templateUrl: './edit-level-modal.html',
  styleUrls: ['./edit-level-modal.scss']
})
export class ModifyBinLevelModalComponent {
  binItem: Bin;

  staffList: Staff[];

  areaList: Area[];

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.binItem = data.binDetails;
    this.binItem.areaId = data.areaSelection;
    this.staffList = data.staffList;
    this.areaList = data.areaList;
  }
}