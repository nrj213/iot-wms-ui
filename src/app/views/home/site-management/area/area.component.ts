import { Component, OnInit, Inject } from '@angular/core';
import { Area } from '@app/views/common/models/area.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpService } from '@app/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from '@app/utils';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { Municipality } from '@app/views/common/models/municipality.model';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  municipalityList: Municipality[];
  municipalitySelection: number;
  
  areaList: Area[];
  areaSelection: number;

  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<Area>(this.areaList);
  selection = new SelectionModel<Area>(true, []);

  constructor(private httpService: HttpService, private dialog: MatDialog) { }

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
  checkboxLabel(row?: Area): string {
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
        this.dataSource = new MatTableDataSource<Area>(this.areaList);

        if (!this.areaList.length) {
          alert("Area data not available!");
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
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(AddAreaModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let url = Constants.AREA_ENDPOINT;
        let body = {
          "name": data.name,
          "municipality-id": this.municipalitySelection
        };

        this.httpService.post(url, body).subscribe((response: any) => {
          if (!isNullOrUndefined(response.code) && response.code == 0) {
            if (response.data > 0) {
              alert("Added successfully");
              this.getAreaData(this.municipalitySelection);
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

        const dialogRef = this.dialog.open(EditAreaModalComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            let url = Constants.AREA_ENDPOINT;
            let body = data;

            this.httpService.put(url, body).subscribe((response: any) => {
              if (!isNullOrUndefined(response.code) && response.code == 0) {
                if (response.data > 0) {
                  alert("Edit successful");
                } else {
                  alert("Failed to edit!");
                }
                this.selection.clear();
                this.getAreaData(this.municipalitySelection);
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
          let url = Constants.AREA_ENDPOINT + "?id=" + id;

          this.httpService.delete(url).subscribe((response: any) => {
            if (!isNullOrUndefined(response.code) && response.code == 0) {
              if (response.data > 0) {
                alert("Deleted successfully")
              } else {
                alert("Failed to delete!")
              }
              this.selection.clear();
              this.getAreaData(this.municipalitySelection);
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
export class AddAreaModalComponent {
  areaItem: Area = {
    name: ''
  }
}

@Component({
  templateUrl: './edit-modal.html',
  styleUrls: ['./edit-modal.scss']
})
export class EditAreaModalComponent {
  areaItem: Area;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.areaItem = data;
  }
}