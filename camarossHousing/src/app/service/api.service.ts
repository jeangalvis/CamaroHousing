import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, tap } from 'rxjs';
import { ICounts } from '../models/count.model';
import { IProperties, Register } from '../models/properties.model';
import { IImagen } from '../models/imagen.model';
import { ISelect } from '../models/select.model';
import { IRegister } from '../models/register.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _http = inject(HttpClient);
  private urlBase = 'http://localhost:5249';
  private _updateSearchString = new BehaviorSubject<string>('');
  updateSearchString = this._updateSearchString.asObservable();


  getCount(): Observable<ICounts> {
    return this._http.get<ICounts>(
      this.urlBase + '/api/Propiedad/GetByCountSellAndRent'
    );
  }
  getOfferts(): Observable<ISelect[]> {
    return this._http.get<ISelect[]>(this.urlBase + '/api/TipoOferta');
  }
  getDomains(): Observable<ISelect[]> {
    return this._http.get<ISelect[]>(this.urlBase + '/api/TipoDominio');
  }
  getProperties(
    PageSize?: number,
    PageIndex?: number,
    Search?: string,
    precioInicial?: number | null,
    precioFinal?: number | null,
    oferta?: string,
    inmueble?: string
  ): Observable<IProperties> {
    let params = new HttpParams();
    // Agrega los parámetros si tienen valor
    if (PageSize !== undefined && PageSize !== null) {
      params = params.set('PageSize', PageSize);
    }
    if (PageIndex !== undefined && PageIndex !== null) {
      params = params.set('PageIndex', PageIndex.toString());
    }
    if (Search !== undefined && Search !== null) {
      params = params.set('Search', Search.toString());
    }
    if (precioInicial !== undefined && precioInicial !== null) {
      params = params.set('precioInicial', precioInicial.toString());
    }
    if (precioFinal !== undefined && precioFinal !== null) {
      params = params.set('precioFinal', precioFinal.toString());
    }
    if (oferta !== undefined && oferta !== null) {
      params = params.set('oferta', oferta.toString());
    }
    if (inmueble !== undefined && inmueble !== null) {
      params = params.set('inmueble', inmueble.toString());
    }
    return this._http.get<IProperties>(
      `${this.urlBase}/api/Propiedad/GetPagFilterProperties`,
      { params: params }
    );
  }

  getPropertieId(id: string): Observable<Register> {
    return this._http.get<Register>(this.urlBase + `/api/Propiedad/${id}`);
  }

  getImage(id: string): Observable<IImagen> {
    return this._http.get<IImagen>(
      this.urlBase + `/api/Imagen/GetImagenByPropiedad?idPropiedadfk=${id}`
    );
  }

  getAllImages(id: string): Observable<IImagen[]> {
    return this._http.get<IImagen[]>(
      this.urlBase + `/api/Imagen/GetAllImagenByPropiedad?idPropiedadfk=${id}`
    );
  }

  updateSearchTerm(term: string): void {
    this._updateSearchString.next(term);
  }

  RegisterUser(email: string, username: string ,password: string): Observable<any> {
    const requestBody = { email:email,username:username ,password:password  };
    return this._http.post(this.urlBase + `/api/User/register`, requestBody, { responseType: 'text' });
  }
  LoginUser(username: string ,password: string): Observable<any> {
    const requestBody = { username:username ,password:password  };
    return this._http.post(this.urlBase + `/api/User/token`, requestBody,{ withCredentials: true, responseType: 'json' });
  }
}
