import { Component, OnInit, Inject } from '@angular/core';
import { Constants } from '@app/utils';
import { HttpService } from '@app/core';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Staff } from '@app/views/common/models/staff.model';

@Component({
  selector: 'app-staff-detail-modal',
  templateUrl: './staff-detail-modal.component.html',
  styleUrls: ['./staff-detail-modal.component.scss']
})
export class StaffDetailModalComponent implements OnInit {

  modalTitle: string;
  staffId: number;
  role: string;
  info: Staff = {
    address: null,
    areaId: null,
    areaName: null,
    dateOfJoining: null,
    dateOfLeaving: null,
    mobileNo: null,
    name: null,
    staffId: null
  };

  constructor(private httpService: HttpService, @Inject(MAT_DIALOG_DATA) data) {
    this.staffId = data.staffId;
    this.modalTitle = data.modalTitle;
    this.role = data.role;
  }

  ngOnInit() {
    this.getStaffDetails(this.staffId);
  }

  getStaffDetails(staffId: number) {
    let url = Constants.STAFF_DETAILS_ENDPOINT + "/" + staffId;

    this.httpService.get(url).subscribe((response: any) => {
      if (!isNullOrUndefined(response.code) && response.code == 0) {
        this.info = response.data;
      } else {
        alert(response.code + " : " + response.message);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

}
