import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { DataService } from '../shared.service';

@Component({ 
    templateUrl: 'home.component.html',
    styles: ['.center { text-align: center; }']
 })
export class HomeComponent implements OnInit, OnDestroy {
    roleForm: FormGroup;
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    isAdmin: boolean;
  
    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private data: DataService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.data.currentMessage.subscribe(message => {
            this.users = message;
        })
    }

    ngOnInit() {
        this.loadAllUsers();
        this.users.forEach(user => {
            if(user.username === this.currentUser.username)
                this.isAdmin = user.roles.indexOf('ROLE_ADMIN') > -1;
        })
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    private async loadAllUsers () {
        /** await this.userService.getAll().pipe(first()).subscribe((users) => {
            this.users = users;
            //let controls = this.users.map(users => )
            this.roleForm = this.formBuilder.group({
                userRoles: this.formBuilder.array([
                    this.users.map((user) => {
                        this.formBuilder.group({
                            ROLE_ADMIN: new FormControl(user.roles.indexOf('ROLE_ADMIN') > 1),
                            ROLE_PROJECTMANAGER: new FormControl(user.roles.indexOf('ROLE_PROJECTMANAGER') > 1),
                            ROLE_CLIENT: new FormControl(user.roles.indexOf('ROLE_CLIENT') > 1)
                        })
                    })
                ])
            });
        }); **/
        //let users = await this.userService.getAll().toPromise();
        //this.users = users;
        this.roleForm = this.formBuilder.group({
            userRoles: this.formBuilder.array([])
        });
        const control = this.roleForm.controls['userRoles'] as FormArray;
        this.users.map((user) => {
            control.push(this.addRow(user));
        })
    }

    addRow(user:User){
        let isAdmin: boolean = user.roles.indexOf('ROLE_ADMIN') > -1;
        let isProjectManager: boolean = user.roles.indexOf('ROLE_PROJECTMANAGER') > -1;
        let isClient: boolean = user.roles.indexOf('ROLE_CLIENT') > -1;
        return this.formBuilder.group({
            USER_NAME: new FormControl(user.username),
            ROLE_ADMIN: new FormControl(isAdmin),
            ROLE_PROJECTMANAGER: new FormControl(isProjectManager),
            ROLE_CLIENT: new FormControl(isClient)
        })
    }

    onSubmit() {
        console.log(this.roleForm);
    }
}