import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService, DataService } from '@app/core';
import { Constants } from '@app/utils';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';

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
          this.dataService.passUserDetails(response.data);
          this.router.navigateByUrl("/wms/municipal");
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
}
