import {HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const Token = localStorage.getItem("TokenId");
 
        if (Token){
            const headers = new HttpHeaders({
                "Authorization": "Bearer " + Token,
                "Content-Type": 'application/json',
                "Access-Control-Allow-Origin": "*"
              });

            const cloneReq = req.clone({headers});
 
            return next.handle(cloneReq);
        }
        else{
             return next.handle(req);    
        }
    }


}
