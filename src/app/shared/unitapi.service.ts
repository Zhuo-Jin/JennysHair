import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUnit } from '../interface/interface';
import { Observable } from 'rxjs';
import { ApiList } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitapiService {

  private apiList = ApiList;
  
  constructor(private httpClient: HttpClient) { }


  GetAllUnits () :Observable<IUnit[]> {
    const url = this.apiList.UnitsApi;

    return this.httpClient.get<IUnit[]>(url);
 
  };
}
