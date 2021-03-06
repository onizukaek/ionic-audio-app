import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Storage } from '@ionic/storage';
import { JwtHelper, AuthHttp } from 'angular2-jwt';
import { Observable, BehaviorSubject } from "rxjs";
import 'rxjs/add/operator/map';

import { EndpointsProvider } from './endpoints';
import { User } from '../models/user';

/*
 Generated class for the AuthProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class AuthProvider {

  private authUser = new BehaviorSubject(null);
  public user$: Observable<User> = this.authUser.asObservable();

  constructor(public readonly authHttp: AuthHttp,
              private readonly http: Http,
              private readonly endpoints: EndpointsProvider,
              private readonly storage: Storage,
              private readonly jwtHelper: JwtHelper) {
  }

  checkLogin() {
    this.storage.get('jwt').then(jwt => {
      if (jwt && !this.jwtHelper.isTokenExpired(jwt)) {
        this.authHttp.get(this.endpoints.getAuth())
          .subscribe(
            () => this.authUser.next(this.jwtHelper.decodeToken(jwt)),
            (err) => this.storage.remove('jwt').then(() => this.authUser.next(null)));
      }
      else {
        this.storage.remove('jwt').then(() => this.authUser.next(null));
      }
    });
  }

  login(values: any): Observable<any> {
    return this.http.post(this.endpoints.getLogin(), values)
      .map(response => {
        console.log(response.text());
        return response.text()
      })
      .map(resp => this.handleResponse(resp))
      .catch(err => Observable.throw(this.handleErrors(err)));
  }

  logout() {
    this.storage.remove('login_response').then(() => this.authUser.next(null));
  }

  signup(values: any): Observable<any> {
    return this.http.post(this.endpoints.getSignup(), values)
      .map(response => {
        console.log(response.text());
        return response.text();
      });
  }

  private handleErrors(err: any): any {
    if (!err.ok && err.statusText == '') {
      err.statusText = 'Erreur de connexion avec le serveur';
    }
    return err;
  }

  private handleResponse(response: string) {
    let responseObj = JSON.parse(response);
    return this.storage.set('login_response', response)
      .then(() =>  this.authUser.next(this.jwtHelper.decodeToken(responseObj.token)))
      .then(() => responseObj.token);
  }

  private handleJwtResponse(jwt: string) {
    console.log(jwt);
    return this.storage.set('jwt', jwt)
      .then(() =>  this.authUser.next(this.jwtHelper.decodeToken(jwt)))
      .then(() => jwt);
  }

}
