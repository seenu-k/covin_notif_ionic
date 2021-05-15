import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Plugins } from '@capacitor/core';
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SlidesGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return Storage.get({key: 'isNewUser'}).then(storageValue => {
        if(storageValue.value==='false') {
          return this.router.createUrlTree(['/app']);
        }
        else {
          return true;
        }
      });
  }

}
