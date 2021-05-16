import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { DataService } from '../data.service';
import { District, State } from '../dataModel';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  userDisplayName: string;
  states: Observable<State[]>;
  districts: Observable<District[]>;
  stateControl = new FormControl(null);
  districtControl = new FormControl({value: null, disabled: true});

  constructor(
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataService.auth.user.subscribe((user) => {
      if(user) {
        this.userDisplayName = user.displayName;
      }
      else {
        this.presentSignInSheet();
      }
    });
    this.states = this.dataService.states.asObservable();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.stateControl.valueChanges.subscribe((state_id: number) => {
      this.districts = this.dataService.getDistricts(state_id);
      this.districtControl.setValue(null);
      this.districtControl.enable();
    });
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.districtControl.valueChanges.subscribe((district_id: number) => {
      if(district_id) {
        console.log(district_id);
      }
    });
  }

  async presentSignInSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Sign In with Google to continue',
      backdropDismiss: false,
      buttons: [{
        text: 'Sign In',
        icon: 'logo-google',
        role: 'signin',
        handler: () => this.dataService.login().then(() => true).catch(() => {
            this.presentToast('Error during Sign In');
            return false;
          })
      }]
    });
    await actionSheet.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500
    });
    toast.present();
  }

}
