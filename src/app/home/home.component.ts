import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '@/_models';
import { UserService, AuthenticationService, AlertService } from '@/_services';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { DataService } from '../shared.service';

@Component({ 
    templateUrl: 'home.component.html',
    styles: []
 })
export class HomeComponent implements OnInit, OnDestroy {
    roleForm: FormGroup;
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    isAdmin: boolean;
    updated: boolean = false;
    error: boolean = false;
  
    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private data: DataService,
        private alertService: AlertService
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
        this.roleForm = this.formBuilder.group({
            userRoles: this.formBuilder.array([])
        });
        const control = this.roleForm.controls['userRoles'] as FormArray;
        this.users.map((user) => {
            control.push(this.addRow(user));
        })
    }

    addRow(user:User){
        let isRoleAdmin: boolean = user.roles.indexOf('ROLE_ADMIN') > -1;
        let isProjectManager: boolean = user.roles.indexOf('ROLE_PROJECTMANAGER') > -1;
        let isClient: boolean = user.roles.indexOf('ROLE_CLIENT') > -1;
        let islocalAdmin = this.isAdmin;
        return this.formBuilder.group({
            USER_NAME: new FormControl(user.username),
            ROLE_ADMIN: new FormControl({value:isRoleAdmin, disabled: islocalAdmin}),
            ROLE_PROJECTMANAGER: new FormControl({value:isProjectManager, disabled: islocalAdmin}),
            ROLE_CLIENT: new FormControl({value:isClient, disabled: islocalAdmin})
        })
    }

    onSubmit() {
        console.log(this.roleForm);
        this.users.forEach(user => {
            let userRole: FormGroup = this.getUserroleObject(user.username);
            user.roles.length = 0;
            if(userRole.value['ROLE_ADMIN']) user.roles.push('ROLE_ADMIN');
            if(userRole.value['ROLE_PROJECTMANAGER']) user.roles.push('ROLE_PROJECTMANAGER');
            if(userRole.value['ROLE_CLIENT']) user.roles.push('ROLE_CLIENT');
        });
        console.log(this.users);
        this.userService.update(this.users).pipe(first())
                .subscribe(
                    data => {
                        this.alertService.success('Roles Updated', true);
                    },
                    error => {
                       console.log('error');
                       console.log(error);
                       this.alertService.error(error);
                    });
    }

    getUserroleObject(username: String) {
        const control = this.roleForm.controls['userRoles'] as FormArray;
        let userformControl: FormGroup;
        control.controls.forEach((userControl: FormGroup) => {
            if(userControl.controls['USER_NAME'].value === username) {
                userformControl = userControl;
            }
        })
        return userformControl;
    }
}