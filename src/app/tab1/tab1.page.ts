import { Component, OnInit } from '@angular/core';

import { ActionSheetController } from '@ionic/angular';

import { DataService } from '../data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  userDisplayName: string;

  constructor(
    public actionSheetController: ActionSheetController,
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
  }

  async presentSignInSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Sign In with Google to continue',
      backdropDismiss: false,
      buttons: [{
        text: 'Sign In',
        icon: 'logo-google',
        role: 'signin',
        handler: () => this.dataService.login().then(userCredentials => {
            console.log(userCredentials.user.displayName);
            return true;
          }).catch((error) => {
            console.log(error);
            return false;
          })
      }]
    });
    await actionSheet.present();
  }

}
