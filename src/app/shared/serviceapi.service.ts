import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IServiceItem } from '../interface/interface';
import { ApiList } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ServiceApiService {


  public apiList = ApiList;

  constructor(private http : HttpClient) { }

  GetAllServiceData() : Observable<IServiceItem[]> {
    let serviceItems = this.http.get<IServiceItem[]>(this.apiList.ServiceApi)
    return serviceItems;
  }

}
