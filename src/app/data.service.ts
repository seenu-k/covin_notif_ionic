import { Injectable } from '@angular/core';

import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public auth: AngularFireAuth
  ) { }

  async login() {
    const googleUser = await Plugins.GoogleAuth.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
    return this.auth.signInWithCredential(credential);
  }

  logout() {
    return this.auth.signOut();
  }

}
