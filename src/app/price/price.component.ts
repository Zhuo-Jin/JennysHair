import { Component, OnInit } from '@angular/core';
import {ServiceApiService} from '../shared/serviceapi.service'
import { IServiceItem, IUnit } from '../interface/interface';


@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})


export class PriceComponent implements OnInit {
  public serviceItems : IServiceItem[];
  public Unit: IUnit;

  constructor(private _serviceApi: ServiceApiService) { 
    this._serviceApi.GetAllServiceData().subscribe(d => this.serviceItems = d);
    this.Unit = JSON.parse(localStorage.getItem("UnitString"));
    
  }

  ngOnInit() {
  }

}
