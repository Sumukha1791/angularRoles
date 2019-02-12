import { User } from '@/_models';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  users: User[] = [];  
  private messageSource = new BehaviorSubject(this.users);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: User[]) {
    this.messageSource.next(message)
    //this.users = message;
  }

}