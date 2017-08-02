/**
 * Created by hkb on 02.08.17.
 */
import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, RequestMethod} from "@angular/http";
import { Storage } from '@ionic/storage';
import { JwtHelper, AuthHttp } from 'angular2-jwt';
import { Observable, BehaviorSubject } from "rxjs";
import 'rxjs/add/operator/map';

import { EndpointsProvider } from './endpoints';
import { Media } from "../models/media";
import {Tag} from "../models/tag";


@Injectable()
export class TagProvider {

  public tag$: Observable<Media[]>;
  private _tags: BehaviorSubject<Tag[]>;
  private _dataStore: {  // This is where we will store our data in memory
    tags: Media[]
  };

  constructor(private readonly http: Http,
              private readonly storage: Storage,
              private readonly endpoints: EndpointsProvider) {

    this._dataStore = {tags: []};
    this._tags = <BehaviorSubject<Media[]>>new BehaviorSubject([]);
    this.tag$ = this._tags.asObservable();

  }

  create(tagData){
    // Data format to post
    // {name: tagName}
    console.log(tagData);
    this.storage.get('login_response').then(resp => {
      let tokenObj = JSON.parse(resp);
      console.log('Token : ' + tokenObj.token);
      let headers: Headers = new Headers({'Authorization': 'JWT ' + tokenObj.token, 'Content-Type': 'application/json'});
      let options: RequestOptions = new RequestOptions({headers: headers});
      console.log(options);
      this.http.post(this.endpoints.getTags(), tagData, options)
        .map(response => {
          console.log(response);
          return response.json()
        })
        .subscribe(
          data => {
            console.log(data);
          },
          error => {
            console.log(error);
          }
        );
    });
  }

  getTags(){
    this.storage.get('login_response').then(resp => {
      let tokenObj = JSON.parse(resp);
      // console.log('The token: ' + tokenObj.token);

      let headers: Headers = new Headers({'Authorization': 'JWT ' + tokenObj.token});
      let options: RequestOptions = new RequestOptions({headers: headers});
      this.http.get(this.endpoints.getTags(), options)
        .map(response => response.json())
        .subscribe(
          data => {
            this._dataStore.tags = data.filter((tag, index)=>{
              return tag;
            });
            this._tags.next(Object.assign({}, this._dataStore).tags);
          },
          error => {console.log(error)}
        );
    });
  }
}