import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ 
    templateUrl: 'home.component.html',
    styles: ['.center { text-align: center; }']
 })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    isAdmin: boolean;
    rolesForm: FormGroup;
    

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        
        this.loadAllUsers();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
            users.forEach((user) => {
                if(user.username === this.currentUser.username) this.isAdmin = user.roles.indexOf('ROLE_ADMIN') > -1;
            })
        });
    }

    onSubmit() {

    }
}