import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  constructor(private dataService: DataService) { }

  roleId: number;

  ngOnInit() {
    this.dataService.currentUserDetails.subscribe(data => this.roleId = data.roleId);
  }

}
