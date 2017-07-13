import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AdalService } from 'ng2-adal/core';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';



import { HttpModule } from '@angular/http';
import { AppComponent }  from './components/app.component';

import { routes } from './routers/app.router';
import { WelcomeComponent } from './components/welcome.component';
import { HomeComponent } from './components/home.component';
import { UploadComponent } from './components/upload.component';
import { SubFolderComponent } from './components/subFolders.component';

import { LoggedInGuard } from './authentication/logged-in.guard';
import { SecretService } from './services/secret.service';
import { GetDataService } from './services/data.service';
import {MultiSelectModule} from 'primeng/primeng';
import {DropdownModule} from 'primeng/primeng';


import { ModalComponent } from './directives/index';
import { ModalService } from './services/index';
import {TooltipModule} from 'ngx-tooltip';



@NgModule({
  imports:      [ BrowserModule, routes, FormsModule, HttpModule, Angular2FontawesomeModule, TooltipModule, MultiSelectModule, DropdownModule  ],
  declarations: [ AppComponent, HomeComponent, WelcomeComponent, ModalComponent, UploadComponent, SubFolderComponent],
  providers: [AdalService, SecretService, LoggedInGuard, GetDataService, ModalService],
  bootstrap:    [ AppComponent ],

})
export class AppModule { }
