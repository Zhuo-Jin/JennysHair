export const environment = {
  production: true,
  ApiDomain: "https://jhcollectionapi-uat.azurewebsites.net/",
  //ApiDomain: "http://localhost:56121/",
  
  TokenUserName: "JHDemo",
  TokenPassword: "123456"
};


// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.




export const ApiList = {
  ServiceApi : environment.ApiDomain + "api/ServiceItems",
  AppointmentApi: environment.ApiDomain + "api/Appointments",
  CustomerApi: environment.ApiDomain + "api/Customers",
  TokenApi: environment.ApiDomain + "api/AuthToken/token",
  StatusApi: environment.ApiDomain + "api/Status",
  UnitsApi: environment.ApiDomain + "api/Units",
  ScheduleApi: environment.ApiDomain + "api/Schedules",
  ScheduleItemApi: environment.ApiDomain + "api/ScheduleItems",
}

export const StatusActive:string = "Active";
export const StatusHold:string = "OnHold";
export const StatusInactive:string = "Inactive";
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
