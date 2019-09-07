import { Injectable } from '@angular/core';
import { IStatus} from '../interface/interface';
import { Observable } from 'rxjs';
import { ApiList } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class StatusapiService {
  private apiList = ApiList;
  

  constructor(private httpClient: HttpClient) { }

  GetAllStatus () :Observable<IStatus[]> {
    const url = this.apiList.StatusApi;

    return this.httpClient.get<IStatus[]>(url);

  };


}
