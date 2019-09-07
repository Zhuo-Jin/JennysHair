import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerapiService } from '../shared/customerapi.service';
import { ICusomter, IStatus } from '../interface/interface';
import { StatusActive, StatusInactive, StatusHold } from '../../environments/environment';
import { Guid } from '../utils/utils';
import { MatDialog } from '@angular/material';
import { PopupdateComponent } from './popupdate/popupdate.component';
import {Location} from '@angular/common';
import { AuthtokenapiService } from '../shared/authtokenapi.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  public displayInvalidMobile:boolean = false;

  public mobilePatten = /^04\d{8}$/;
  public emailPatten = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  loginForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.required, Validators.pattern(this.emailPatten)]],
    mobile: ['', [Validators.required, Validators.pattern(this.mobilePatten)]],
  });

  constructor(private fb: FormBuilder, 
              private httpCustomer: CustomerapiService, 
              public dialog:MatDialog,
              public auth: AuthtokenapiService,
              private location: Location
              ) { }

  ngOnInit() {
    if (localStorage.getItem("User")){
      this.location.back();
    }
  }

  onSubmit()
  {
    
    this.httpCustomer.GetCustomerFromMobileNumber(this.loginForm.value.mobile)
      .subscribe(result => {
        var status:IStatus[] = JSON.parse(localStorage.getItem("StatusString"));
        if (result.Mobile == null){
          // new customer

          let customer:ICusomter = {
                                      Id: Guid.newGuid(),
                                      Mobile: this.loginForm.value.mobile,
                                      Email: this.loginForm.value.email,
                                      Firstname: this.loginForm.value.firstName,
                                      Surname:this.loginForm.value.lastName,
                                      IsAdmin:false,
                                      StatusId: status.find( s => s.StatusName == StatusActive).Id,

          };
          


          this.httpCustomer.UpsertCustomerFromMobileNumber(customer).subscribe(res => res);
          this.loginForm.reset();
          localStorage.setItem("User" , JSON.stringify(customer));
          this.auth.setIsLoggedIn(true);
          console.log (JSON.stringify(customer));

          this.location.back();

          //this.router.navigateByUrl('/appointment');
        }
        else{
          // update 

          let propDifference:any[] = [];
          if (result.Email != this.loginForm.value.email && this.loginForm.value.email != '')
            propDifference.push(['Mobile', result.Email, this.loginForm.value.email]);

          if (result.Firstname != this.loginForm.value.firstName && this.loginForm.value.firstName != '')
            propDifference.push(['Mobile', result.Firstname, this.loginForm.value.firstName]);
          
          if (result.Surname != this.loginForm.value.lastName && this.loginForm.value.lastName != '')
            propDifference.push(['Mobile', result.Surname, this.loginForm.value.lastName])

          if (propDifference.length > 0)
          {
             // pop up confirmation dialog  
            const dialogRef = this.dialog.open(PopupdateComponent, { 
              data: propDifference,  disableClose:true 
            });

            dialogRef.afterClosed().subscribe(updateValue => {
              if (updateValue == 'update')
              {
                //merge data
                let customer:ICusomter = {
                  Id: result.Id,
                  Mobile: result.Mobile,
                  Email: this.loginForm.value.email != '' ? this.loginForm.value.email : result.Email,
                  Firstname: this.loginForm.value.firstName != '' ? this.loginForm.value.firstName : result.Firstname,
                  Surname:this.loginForm.value.lastName != '' ? this.loginForm.value.lastName : result.Surname,
                  IsAdmin:false,
                  StatusId: status.find( s => s.StatusName == StatusActive).Id,
                };

                this.httpCustomer.UpsertCustomerFromMobileNumber(customer).subscribe(res => res);
                this.loginForm.reset();

                localStorage.setItem("User" , JSON.stringify(customer));

                this.location.back();
                //this.router.navigateByUrl('/appointment');
              }
              else if (updateValue == 'keep')
              {
                //log into localStorage
                localStorage.setItem("User" , JSON.stringify(result));
                this.location.back();
                //this.router.navigateByUrl('/appointment');
              }
            
            })
          }
          else{
            localStorage.setItem("User" , JSON.stringify(result));
            this.auth.setIsLoggedIn(true);
            this.location.back();
            //this.router.navigateByUrl('/appointment');
            
          }

        }
      });
  }

  onBack()
  {
    this.location.back();

  }
}
