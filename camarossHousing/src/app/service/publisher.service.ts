import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IPublisher } from '../models/publisher.model';
import { Observable, catchError, tap } from 'rxjs';
import { IUser } from '../models/user.model';
import { Response } from 'cross-fetch';
import { Register } from '../models/properties.model';

@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  private _http = inject(HttpClient);
  private urlBase = 'http://localhost:5249';

  getPublisher(id: string, token: string): Observable<IPublisher> {
    return this._http
      .get<IPublisher>(
        this.urlBase + `/api/Publicista/GetPublicistaByIdUser`,
        { headers: { Authorization: `Bearer ${token}` },params: { IdUserfk: id } }
        ,
      )
      .pipe(
        tap((response) => {
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error:', error);
          if (error.status === 401) {
            console.log('no autorizado');
          }
          if (error.status === 204) {
            console.log('No hay publicista con el ID');
          }
          if (error.status === 500) {
            console.log('server error:', error);
          }
          throw error;
        })
      );
  }
  getUserName(username: string, token: string | null): Observable<IUser> {
    return this._http
      .get<any>(this.urlBase + `/api/User`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { name: username },
      })
      .pipe(
        tap((response) => {

        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error:', error);
          if (error.status === 401) {
            console.log('no autorizado');
          }
          if (error.status === 204) {
            console.log('No hay usuario con el nombre');
          }
          if (error.status === 500) {
            console.log('server error:', error);
          }
          throw error;
        })
      );
  }
  getProperties(id: string, token: string): Observable<Register[]> {
    return this._http
      .get<Register[]>(
        this.urlBase + `/api/Propiedad/GetAllPropertiesByIdPublisher`,
        { headers: { Authorization: `Bearer ${token}` },params: { IdPublicistafk: id } }
        ,
      )
      .pipe(
        tap((response) => {

        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error:', error);
          if (error.status === 401) {
            console.log('no autorizado');
          }
          if (error.status === 204) {
            console.log('No hay propiedad con el ID');
          }
          if (error.status === 500) {
            console.log('server error:', error);
          }
          throw error;
        })
      );
  }

  setPublisher(nombre:string,apellido:string,nombreComercial:string,telefono:string, idUserfk: string ,token: string): Observable<any> {
    const requestBody = { nombre:nombre,apellido:apellido,nombreComercial:nombreComercial,telefono:telefono,idUserfk:idUserfk};
    return this._http.post(this.urlBase + `/api/Publicista`, requestBody, {headers:{Authorization: `Bearer ${token}`}, responseType: 'json' });
  }

  updatePublisher(id: string, nombre: string, apellido: string, nombreComercial: string, telefono: string, idUserfk: string, token: string): Observable<any> {
    const url = `${this.urlBase}/api/Publicista/${id}`;
    const requestBody = {
      id: id,
      nombre: nombre,
      apellido: apellido,
      nombreComercial: nombreComercial,
      telefono: telefono,
      idUserfk: idUserfk
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': '*/*'
    });

    return this._http.put(url, requestBody, { headers: headers, responseType: 'json' });
  }
  
}
