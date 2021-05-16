import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import { StatesResponse, State, DistrictResponse } from './dataModel';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  states = new BehaviorSubject<State[]>([]);

  constructor(
    public auth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.getStates().subscribe(states => {
      this.states.next(states);
    });
  }

  async login() {
    const googleUser = await Plugins.GoogleAuth.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
    return this.auth.signInWithCredential(credential);
  }

  logout() {
    return this.auth.signOut();
  }

  getStates() {
    return this.http.get<StatesResponse>('https://cdn-api.co-vin.in/api/v2/admin/location/states')
      .pipe(map(stateResponse => stateResponse.states));
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  getDistricts(state_id: number) {
    return this.http.get<DistrictResponse>(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`)
      .pipe(map(districtResponse => districtResponse.districts));
  }

}
