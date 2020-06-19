import { Component, OnInit, Inject } from '@angular/core';
import { Constants } from '@app/utils';
import { isNullOrUndefined } from 'util';
import { HttpService } from '@app/core';
import { CollectionRecord } from '@app/views/common/models/collectionrecord.model';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StaffDetailModalComponent } from '../staff-detail-modal/staff-detail-modal.component';

@Component({
  selector: 'app-popup',
  templateUrl: './collection-history-modal.component.html',
  styleUrls: ['./collection-history-modal.component.scss']
})
export class CollectionHistoryModalComponent implements OnInit {
  binId: number;
  records: CollectionRecord[] = [];
  dataSource = new MatTableDataSource<CollectionRecord>(this.records);
  displayedColumns: string[] = [];

  constructor(private httpService: HttpService, @Inject(MAT_DIALOG_DATA) data, private dialog: MatDialog) {
    this.binId = data;
  }

  ngOnInit() {
    this.displayedColumns = ['created', 'staffName'];
    this.getCollectionRecords(this.binId);
  }

  getCollectionRecords(binId: number) {
    let url = Constants.COLLECTION_RECORD_ENDPOINT + "/" + binId;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        if (response.data.length) {
          this.records = response.data;
          this.dataSource = new MatTableDataSource<CollectionRecord>(this.records);
        }
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  showStaffDetails(staffId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      staffId,
      modalTitle: "Staff Details"
    }
    dialogConfig.width = '350px';

    this.dialog.open(StaffDetailModalComponent, dialogConfig);
  }
}
