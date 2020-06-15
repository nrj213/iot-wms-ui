import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from '@app/core';
import { User } from '../../models/user.model';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  initials: string;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.currentUserDetails.subscribe(details => this.currentUser = details);
    this.initials = this.getInitials(this.currentUser.name);
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
}
