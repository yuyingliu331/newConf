import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AdalService} from 'ng2-adal/core';
import { GetDataService } from '../services/data.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private adalService: AdalService,
              private router: Router,private dataService: GetDataService) {}

  canActivate() {
    if (this.adalService.userInfo.isAuthenticated) {
      let appIdUri = 'https://viacom.onmicrosoft.com/vmsapidev';
      let token;
      this.adalService.acquireToken(appIdUri).subscribe(p => {
        token = p;
        localStorage.setItem('id_token', token);
      });
      let currentUser;

      this.dataService.getCurrentUser()
        .then((data: any) => {
          currentUser = JSON.stringify(data);
          sessionStorage.setItem('currentUser', currentUser);
        });
      return true;
    } else {
      this.router.navigate(['/welcome']);
      return false;
    }
  }
}
