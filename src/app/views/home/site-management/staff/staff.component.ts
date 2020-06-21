import { Component, OnInit, Inject } from '@angular/core';
import { Staff } from '@app/views/common/models/staff.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Municipality } from '@app/views/common/models/municipality.model';
import { HttpService } from '@app/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from '@app/utils';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { Area } from '@app/views/common/models/area.model';
import { Role } from '@app/views/common/models/role.model';
import { Status } from '@app/views/common/models/status.model';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  municipalityList: Municipality[];
  municipalitySelection: number;

  areaList: Area[];
  areaSelection: number;
  
  staffList: Staff[];
  staffSelection: number;

  roleList: Role[];
  roleSeletion: number;

  statusList: Status[];
  statusSelection: number;

  displayedColumns: string[] = ['select', 'staffId', 'name', 'address', 'mobileNo', 'dateOfJoining', 'dateOfLeaving', 'username', 'password', 'status', 'role'];
  dataSource = new MatTableDataSource<Staff>(this.staffList);
  selection = new SelectionModel<Staff>(true, []);

  constructor(private httpService: HttpService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getMunicipalityData();
    this.getRoleData();
    this.getStatusData();
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
  checkboxLabel(row?: Staff): string {
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
      this.getAreaData(this.municipalitySelection);
    }
  }
  
  getAreaData(municipalityId) {
    let url = Constants.AREA_ENDPOINT + "/" + municipalityId;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.areaList = response.data;
        if(!this.areaList.length) {
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
    if (!isNaN(this.areaSelection)) {
      this.getStaffData(this.areaSelection)
    }
  }

  getStaffData(areaId) {
    let url = Constants.STAFF_DETAILS_ENDPOINT + "?areaId=" + areaId;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.staffList = response.data;
        this.dataSource = new MatTableDataSource<Staff>(this.staffList);

        if (!this.staffList.length) {
          alert("Staff details not available!");
        }
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  getRoleData() {
    let url = Constants.ROLE_DETAILS_ENDPOINT;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.roleList = response.data;
        if(!this.roleList.length) {
          alert("Failed to get role data!");
        }
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  getStatusData() {
    let url = Constants.STATUS_DETAILS_ENDPOINT;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.statusList = response.data;
        if(!this.statusList.length) {
          alert("Failed to get status data!");
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
      "roleList": this.roleList,
      "statusList": this.statusList
    }
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(AddStaffModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data) {
        let url = Constants.STAFF_DETAILS_ENDPOINT;
        let body = {
          "name": data.name,
          "municipality-id": this.municipalitySelection
        };

        this.httpService.post(url, body).subscribe((response: any) => {
          if (!isNullOrUndefined(response.code) && response.code == 0) {
            if (response.data > 0) {
              alert("Added successfully");
              this.getStaffData(this.municipalitySelection);
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
        dialogConfig.data = selected[0];
        dialogConfig.width = '500px';

        const dialogRef = this.dialog.open(EditStaffModalComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            let url = Constants.STAFF_DETAILS_ENDPOINT;
            let body = data;

            this.httpService.put(url, body).subscribe((response: any) => {
              if (!isNullOrUndefined(response.code) && response.code == 0) {
                if (response.data > 0) {
                  alert("Edit successful");
                } else {
                  alert("Failed to edit!");
                }
                this.selection.clear();
                this.getStaffData(this.municipalitySelection);
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
          let id = selected[0].id;
          let url = Constants.STAFF_DETAILS_ENDPOINT + "?id=" + id;

          this.httpService.delete(url).subscribe((response: any) => {
            if (!isNullOrUndefined(response.code) && response.code == 0) {
              if (response.data > 0) {
                alert("Deleted successfully")
              } else {
                alert("Failed to delete!")
              }
              this.selection.clear();
              this.getStaffData(this.municipalitySelection);
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
}

@Component({
  templateUrl: './add-modal.html',
  styleUrls: ['./add-modal.scss']
})
export class AddStaffModalComponent {
  staffItem: Staff = {
    name: '',
    address: '',
    mobileNo: '',
    areaId: null,
    dateOfJoining: '',
    dateOfLeaving: ''
  }

  areaList: Area[];
  // areaSelection: number;

  roleList: Role[];
  // roleSelection: number;

  statusList: Status[];
  // statusSelection: number;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.areaList = data.areaList;
    this.staffItem.areaId = data.areaSelection;
    this.roleList = data.roleList;
    this.statusList = data.statusList;
  }
}

@Component({
  templateUrl: './edit-modal.html',
  styleUrls: ['./edit-modal.scss']
})
export class EditStaffModalComponent {
  staffItem: Staff;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.staffItem = data;
  }
}