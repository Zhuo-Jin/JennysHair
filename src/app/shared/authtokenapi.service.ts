import { Injectable } from '@angular/core';
import {ApiList, environment} from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthtokenapiService {

  public apiList = ApiList;
  public env = environment;
  private _isLoggedin: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private httpClient: HttpClient) { 
    if (localStorage.getItem("User")){
      this._isLoggedin = new BehaviorSubject(true);
    }
  }

  getIsLoggedIn() : Observable <boolean> {
      return this._isLoggedin.asObservable();

  }

  setIsLoggedIn(isLoggedin: boolean) {
    this._isLoggedin.next(isLoggedin);
  }

  GetTokenId(){
    
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type' : 'application/json'})
    }
    return this.httpClient
          .post(this.apiList.TokenApi, 
                {Username: this.env.TokenUserName, Password: this.env.TokenPassword},
                httpOptions)    
          ;

  }
}
