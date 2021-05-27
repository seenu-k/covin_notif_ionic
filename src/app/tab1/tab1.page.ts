import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { DataService } from '../data.service';
import { District, PersonPreferencesControl, State, PersonPreferences, User, LocationType } from '../dataModel';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  userDisplayName: string;
  locationType: LocationType = 'district';
  states: Observable<State[]>;
  districts: District[];
  stateControl = new FormControl(null);
  districtControl = new FormControl({value: null, disabled: true});
  pinCodeControl = new FormControl('', Validators.pattern('^[1-9][0-9]{5}$'));
  selectedStateId: number;
  selectedDistrictId: number;
  setDistrictFromDatabase = false;
  districtFromDatabase: number;
  selectedPinCode: string;
  personPreferencesControls: PersonPreferencesControl[] = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public alertController: AlertController,
    public dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataService.auth.user.subscribe((user) => {
      if(user) {
        this.userDisplayName = user.displayName;
        this.dataService.getUser(user.uid).then((userDetails) => {
          if(userDetails.location_type==='district') {
            this.locationType = 'district';
            this.stateControl.setValue(userDetails.location_state);
            this.districtFromDatabase = userDetails.location_district;
            this.setDistrictFromDatabase = true;
          }
          else {
            this.locationType = 'pincode';
            this.pinCodeControl.setValue(userDetails.location_pincode);
          }
        }).catch(() => {
          this.presentToast('Error retrieving saved preferences');
        });
      }
      else {
        this.presentSignInSheet();
      }
    });
    this.states = this.dataService.states.asObservable();
    this.stateControl.valueChanges.subscribe((stateId: number) => {
      this.dataService.getDistricts(stateId).subscribe((districts) => {
        this.districts = districts;
        if(!districts.map(district => district.district_id).includes(this.districtControl.value)) {
          this.districtControl.setValue(null);
        }
        if(this.setDistrictFromDatabase) {
          this.districtControl.setValue(this.districtFromDatabase);
          this.setDistrictFromDatabase = false;
        }
      });
      //this.districtControl.setValue(null);
      this.districtControl.enable();
    });
    this.districtControl.valueChanges.subscribe((districtId: number) => {
      if(districtId) {
        this.selectedDistrictId = districtId;
        this.selectedStateId = this.stateControl.value;
      }
      else {
        this.selectedDistrictId = null;
        this.selectedStateId = null;
      }
    });
    this.pinCodeControl.valueChanges.subscribe((pinCode: string) => {
      if(pinCode.match('^[1-9][0-9]{5}$')) {
        this.selectedPinCode = pinCode;
      }
      else {
        this.selectedPinCode = null;
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

  async presentInputName() {
    const alert = await this.alertController.create({
      header: 'Add a person',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Enter name',
          value: this.personPreferencesControls.length>0?'':this.userDisplayName
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Add',
          handler: (alertData: {name: string}) => {
            if(alertData.name) {
              this.personPreferencesControls.push({name: alertData.name, preferenceControl: this.getNewPreferenceControl()});
            }
            else {
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  locationChanged(locationChangeEvent: {detail: {value: LocationType}}) {
    this.locationType = locationChangeEvent.detail.value;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  getNewPreferenceControl(fee_type_preference = 'Any', min_age_limit_preference = 18, vaccine_preference = 'ANY') {
    return new FormGroup({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fee_type_preference: new FormControl(fee_type_preference),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      min_age_limit_preference: new FormControl(min_age_limit_preference),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vaccine_preference: new FormControl(vaccine_preference)
    });
  }

  onPersonDelete(name: string) {
    this.personPreferencesControls.splice(this.personPreferencesControls.findIndex(person => person.name===name), 1);
  }

  onNotify() {
    if(this.locationType==='district' && !this.selectedDistrictId) {
      this.presentToast('Invalid District');
      return;
    }
    if(this.locationType==='pincode' && !this.selectedPinCode) {
      this.presentToast('Invalid PinCode');
      return;
    }
    const personPreferences = this.personPreferencesControls
      .map(person => ({...person.preferenceControl.value, name: person.name})) as PersonPreferences[];
    const user: User = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      location_type: this.locationType,
      persons: personPreferences,
    };
    if(this.locationType==='district') {
      user.location_district = this.selectedDistrictId;
      user.location_state = this.selectedStateId;
    }
    else {
      user.location_pincode = this.selectedPinCode;
    }
    this.dataService.setUser(user).then(() => {
      this.dataService.addLocation(this.locationType==='district'?this.selectedDistrictId:this.selectedPinCode).then(() => {
        this.presentToast('Preferences Successfully Saved');
      }).catch(() => {
        this.presentToast('Error saving preferences');
      });
    }).catch(() => {
      this.presentToast('Error saving preferences!');
    });
  }

}
