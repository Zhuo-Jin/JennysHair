import { Injectable } from '@angular/core';

import  {ApiList} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICusomter } from '../interface/interface';
import { Guid } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class CustomerapiService {

  public appList = ApiList;

  constructor(private httpClient: HttpClient) { }

  GetCustomerFromMobileNumber(mobile:string)
  {
    let _customerfroMobile  = this.appList.CustomerApi + "/GetCustomerFromMobile/" + mobile;
    return this.httpClient.get<ICusomter>(_customerfroMobile);

  }

  UpsertCustomerFromMobileNumber(customer: ICusomter)
  {
    
    let _customerfroMobile  = this.appList.CustomerApi + "/UpsertCustomer";

    return this.httpClient.post(_customerfroMobile, customer);
  }

  
}


