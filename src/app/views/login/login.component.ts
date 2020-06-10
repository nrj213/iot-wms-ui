import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService, DataService } from '@app/core';
import { Constants } from '@app/utils';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { User } from '../common/models/user.model';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private httpService: HttpService, private dataService: DataService) { }

  username: string = "";
  password: string = "";

  ngOnInit() { }

  login() {
    if (this.username.length && this.password.length) {
      let url = Constants.USER_ENDPOINT;
      let headers = new HttpHeaders().append('username', this.username).append('password', this.password);

      this.httpService.get(url, { headers }).subscribe((response: any) => {
        if (!isNullOrUndefined(response.code) && response.code == 0) {
          let userData: User = response.data;
          let areaId: number = userData.areaId;

          this.getMunicipalityId(areaId).then((municipalityId: number) => {
            userData = {
              ...userData,
              municipalityId
            }
            this.dataService.passUserDetails(userData);

            let roleId = userData.roleId;

            if (roleId == 1) {
              this.router.navigateByUrl("/wms/admin");
            } else if (roleId == 2) {
              this.router.navigateByUrl("/wms/municipal");
            } else {
              this.router.navigateByUrl("/wms/area");
            }
          });
        } else {
          alert("Login failed!")
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
    } else {
      alert("Enter username and password!");
    }
  }

  getMunicipalityId(areaId: number) {
    let url = Constants.MUNICIPALITY_ENDPOINT + "/" + areaId;

    return new Promise((resolve, reject) => {
      this.httpService.get(url).subscribe((response: any) => {
        if (!isNullOrUndefined(response.code) && response.code == 0) {
          if (response && response.data.length && response.data[0].municipalityId) {
            resolve(response.data[0].municipalityId);
          } else {
            reject(null);
          }
        }
      }, (error: HttpErrorResponse) => {
        reject(null);
        console.log(error);
      });
    });
  }
}
