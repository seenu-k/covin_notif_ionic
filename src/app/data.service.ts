import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public auth: AngularFireAuth
  ) { }

  login() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    return this.auth.signOut();
  }

}
