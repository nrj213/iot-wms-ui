import { Component, OnInit, Inject } from '@angular/core';
import { Constants } from '@app/utils';
import { HttpService } from '@app/core';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Municipality } from '@app/views/common/models/municipality.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.scss']
})
export class MunicipalityComponent implements OnInit {
  municipalityList: Municipality[];
  municipalitySelection: number;

  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<Municipality>(this.municipalityList);
  selection = new SelectionModel<Municipality>(true, []);

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
  checkboxLabel(row?: Municipality): string {
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
        this.dataSource = new MatTableDataSource<Municipality>(this.municipalityList);

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

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(AddMunicipalityModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log(data);

      if (data) {
        let url = Constants.BIN_ENDPOINT + "/collected";
        let body = {
          "name": data.name
        };

        this.httpService.put(url, body).subscribe((response: any) => {
          if (!isNullOrUndefined(response.code) && response.code == 0) {
            if (response.data > 0) {

              alert("Added successfully");
              this.getMunicipalityData();
            } else {
              alert("Failed to add!")
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

        const dialogRef = this.dialog.open(EditMunicipalityModalComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
          console.log(data);

          if (data) {
            let url = Constants.BIN_ENDPOINT + "/collected";
            let body = data;

            this.httpService.put(url, body).subscribe((response: any) => {
              if (!isNullOrUndefined(response.code) && response.code == 0) {
                if (response.data > 0) {

                  alert("Added successfully")
                } else {
                  alert("Failed to add!")
                }
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
        let id = selected[0].id;
        console.log(id);
        let url = Constants.BIN_ENDPOINT + "/collected";

        this.httpService.delete(url).subscribe((response: any) => {
          if (!isNullOrUndefined(response.code) && response.code == 0) {
            if (response.data > 0) {

              alert("Added successfully")
            } else {
              alert("Failed to add!")
            }
          } else {
            alert(response.code + " : " + response.message);
          }
        }, (error: HttpErrorResponse) => {
          console.log(error);
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
export class AddMunicipalityModalComponent {
  municipalityItem: Municipality = {
    name: ''
  }
}

@Component({
  templateUrl: './edit-modal.html',
  styleUrls: ['./edit-modal.scss']
})
export class EditMunicipalityModalComponent {
  municipalityItem: Municipality;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.municipalityItem = data;
  }
}