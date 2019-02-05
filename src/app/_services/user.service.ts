import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '@/_models';
import { AuthenticationService } from '@/_services';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

    getAll() {
        let currentUser = this.authenticationService.currentUserValue;
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+currentUser.token);
        return this.http.get<User[]>(`${config.apiUrl}/users/roles`);
    }

    register(user: User) {
        return this.http.post(`${config.apiUrl}/users/signup`, user);
    }

    update(user: User) {
        return this.http.put(`${config.apiUrl}/users/roles`, user);
    }

}