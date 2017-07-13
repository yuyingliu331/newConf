import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';

@Injectable()
export class GetDataService {
    token: any;
    constructor(public http: Http) {
        this.http = http;
    }

  jwt(): any {

    /** Auth settings **/
    let apiKey = 'F3A4F748-604A-4CDB-83AF-58B20FAC327B';
    let headers = new Headers();
    this.token = localStorage.getItem('id_token');
    headers.append('ApiKey', apiKey);
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.token);
    let options = new RequestOptions({headers: headers});
    return options;
  }

  getDevUrl(): any {
    /** staging setting **/
    return 'http://als-stg-1.mtvn.ad.viacom.com/alias/venus/';
  }

  getLocalUrl(): any {
    /** local settings **/
    return 'http://localhost:55200/';
  }
  getSystemOrigin(): any {
    return this.http.get(this.getDevUrl() + 'SystemOfOrigin', this.jwt())
                    .map(response  => response.json());
  }


  getPriority(): any {
    return this.http.get(this.getDevUrl() + 'Priorities', this.jwt())
                    .map(response  => response.json());
  }

  getContentType(): any {
    return this.http.get(this.getDevUrl() + 'ContentType', this.jwt())
                    .map(response  => response.json());
  }

  getChannel(): any {
    return this.http.get(this.getDevUrl() + 'Channels', this.jwt())
                    .map(response  => response.json());
  }

  getRen(): any {
    return this.http.get(this.getDevUrl() + 'Rendition', this.jwt())
                    .map(data => data.json())
                    .catch((err: any) => err);
  }
  getFormat(): any {
    return this.http.get(this.getDevUrl() + 'api/Formats/RenditionId?renditionId=102', this.jwt())
                    .map(response  => response.json());

  }

  getWorkFlow(formatId: number): any {
    let serviceUrl = 'api/workflowtemplate/sourceFormat?formatID=' + formatId + "&$filter=WorkflowTemplateType eq 'Ingest' and IsActive eq true";
    return this.http.get(this.getDevUrl() + serviceUrl, this.jwt())
                    .map(response  => response.json());
  }

  getArchivalRule(): any {
    return this.http.get(this.getDevUrl() + 'ArchivalRules', this.jwt())
                    .map(response => response.json());
  }

  getCurrentUser(): any {
      return this.http.get(this.getDevUrl() + 'api/user', this.jwt())
                      .map(response => response.json())
                      .toPromise()
                      .catch(this.handleError);
  }

  getLibraries(): any {
    return this.http.get(this.getDevUrl() + 'api/Library?$filter=TypeId eq 5 and IsActive eq true', this.jwt())
                    .map(response => response.json())
                    .catch(this.handleError);

  }
  getChildLibrary(libraryId: number, relativePath: string): any {
    return this.http.get(this.getDevUrl() + 'api/getDirectories?libraryId=' + libraryId + '&relativePath=' + relativePath + '&filter=*.*', this.jwt())
                    .map(response => response.json())
                    .catch(this.handleError);
  }


  getTemplates(): any {
    return this.http.get(this.getDevUrl() + 'AttributeTemplate?$filter=AttributeTemplateValue%2Fall(x1%3A%20x1%2FItemType%20eq%20%27Content%27)&$orderby=AttributeTemplateDesc&$expand=AttributeTemplateValue',this.jwt())
                    .map(response => response.json());

  }


  getCodeSets(): any {
    return this.http.get(this.getDevUrl()+ "CodeSets?$filter=((ActiveInd%20eq%20true)%20and%20(Level%20eq%20'Content'))%20and%20(Usage%20eq%20'Tech%20Attributes')&$orderby=CodeSet1",this.jwt())
                    .map(response => response.json());
  }

  getCodeValues(): any {
    return this.http.get(this.getDevUrl() + 'CodeValues?$orderby=CodeValueValue', this.jwt())
                    .map(response => response.json())
  }
  submitBulkIngest(ingestItem): any {
      return this.http.post(this.getDevUrl() + 'api/SubmitBulkIngest', ingestItem, this.jwt())
                      .map(response => response.json())
                      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
      // In a real world app, you might use a remote logging infrastructure
      let errMsg: string;
      if (error instanceof Response) {
          const body = error.json() || '';
          const err = JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
          errMsg = error.message ? error.message : error.toString();
      }
      console.error(errMsg);
      return Observable.throw(errMsg);
  }

}
