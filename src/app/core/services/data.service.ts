import { Injectable, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {

    @Output() toggleEvent: EventEmitter<any> = new EventEmitter();
    
    toggleNavBar() {
        this.toggleEvent.emit();
    }

    private userFirstName = new BehaviorSubject({});
    currentUserFirstName = this.userFirstName.asObservable();

    private userLastName = new BehaviorSubject({});
    currentUserLastName = this.userLastName.asObservable();
    
    private userRoles = new BehaviorSubject({});
    currentUserRoles = this.userRoles.asObservable();

    passUserFirstName(data: Object) {
        this.userFirstName.next(data);
    }

    passUserLastName(data: Object) {
        this.userLastName.next(data);
    }
    passUserRoles(data: Object) {
        this.userRoles.next(data);
    }

}