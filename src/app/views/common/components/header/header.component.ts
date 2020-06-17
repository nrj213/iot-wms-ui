import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from '@app/core';
import { User } from '../../models/user.model';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { StaffDetailModalComponent } from '@app/views/home/staff-detail-modal/staff-detail-modal.component';
import { Constants } from '@app/utils';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  initials: string;

  constructor(private router: Router, private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit() {
    this.dataService.currentUserDetails.subscribe(details => {
      if (details.roleId) {
        this.currentUser = details;
        this.initials = this.getInitials(this.currentUser.name);
      } else {
        let sessionUserInfo = JSON.parse(sessionStorage.getItem(Constants.SESSION_STORAGE_NAME));
        if (sessionUserInfo && sessionUserInfo.roleId) {
          this.currentUser = sessionUserInfo;
          this.initials = this.getInitials(this.currentUser.name);
          this.dataService.passUserDetails(sessionUserInfo);
        } else {
          this.router.navigateByUrl("");
        }
      }
    });
  }

  logout() {
    if (confirm("Logout from session?")) {
      this.dataService.passUserDetails({
        name: null,
        statusId: null,
        roleId: null,
        roleName: null,
        areaId: null,
        staffId: null
      });
      sessionStorage.removeItem(Constants.SESSION_STORAGE_NAME);
      this.router.navigateByUrl("");
    } else {
      return false;
    }
  }

  getInitials(string) {
    if (string && string.length) {
      let initials = string.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

      if (initials.length > 2) {
        initials.pop();
        return initials.join('');
      }
      return initials.join('');
    }
    return '';
  }

  showStaffDetails(staffId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      staffId,
      modalTitle: "Your Profile",
      role: this.currentUser.roleName
    };
    dialogConfig.width = '350px';

    this.dialog.open(StaffDetailModalComponent, dialogConfig);
  }
}
