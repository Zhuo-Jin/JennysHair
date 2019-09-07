import { Component, OnInit } from '@angular/core';

import { AuthtokenapiService } from './shared/authtokenapi.service';
import { StatusapiService } from './shared/statusapi.service';
import { IStatus, ICusomter, IUnit } from './interface/interface';
import { UnitapiService } from './shared/unitapi.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  userLogin: boolean = false;
  public user:ICusomter = {
    Id:"",
    Mobile:"",
    Email:"",
    Firstname:"",
    Surname:"",
    IsAdmin:false,
    StatusId:"",
   };

  constructor(private tokenapi: AuthtokenapiService, private statusapi: StatusapiService, private unitapi:UnitapiService){
    
  }

  ngOnInit(){
    //get token for interceptor
    this.tokenapi.GetTokenId().subscribe((result:any) => {
          localStorage.setItem("TokenId", result.access_token);
          this.statusapi.GetAllStatus().subscribe(
            (restult: IStatus[]) => {localStorage.setItem("StatusString", JSON.stringify(restult)); } 
          );

          this.unitapi.GetAllUnits().subscribe(
            (restult: IUnit[]) => {localStorage.setItem("UnitString", JSON.stringify(restult[0]));}
          );
  
      });

      this.tokenapi.getIsLoggedIn().subscribe(r => {
        this.userLogin = r;
        if (localStorage.getItem("User")){
          this.user = JSON.parse(localStorage.getItem("User"))
        }
 
      });
    
  }

  logOut(){
    this.tokenapi.setIsLoggedIn(false);
    localStorage.removeItem("User");
    this.userLogin = false;
  }

}
