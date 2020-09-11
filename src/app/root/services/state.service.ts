import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {

    access: BehaviorSubject<boolean> = new BehaviorSubject(true); //TODO:
    unsaved: BehaviorSubject<boolean> = new BehaviorSubject(false); //TODO:
    lang: string = 'pl';
    serverInfo: Subject<{ error, message }> = new Subject();

    setToken(token: string, message: string) {
        localStorage.setItem('token', token);
        this.serverInfo.next({ error: null, message });
        this.access.next(true);
    }

    logOut(error = null, message = 'you are logged out') {
        localStorage.removeItem('token');
        this.serverInfo.next({ error, message });
        this.access.next(false);
    }

    setAccess(error: string, message: string) {
        this.serverInfo.next({ error, message });
        this.access.next(error ? false : true);
    }

}
