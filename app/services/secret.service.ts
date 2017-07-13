import {Injectable} from '@angular/core';

@Injectable()
export class SecretService {
  public get adalConfig(): any {
    return {
      tenant: 'viacom.onmicrosoft.com',
      clientId: '54b99e61-3cf5-4064-bf83-b82a5de9ad26',
      redirectUri: window.location.origin + '/',
      postLogoutRedirectUri: window.location.origin + '/'
    };
  }
}
