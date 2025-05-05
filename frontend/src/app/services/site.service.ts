import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Site {
  site_id?: number;
  site_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private apiUrl = 'http://localhost:3000/api/sites';
  private addapiUrl = 'http://localhost:3000/api/sites/addSite';
 

  constructor(private http: HttpClient) {}

  getSites(): Observable<any> {
    return this.http.get(`${this.apiUrl}`,{ withCredentials: true});
  }

  createSite(site: Site): Observable<any> {
    return this.http.post(`${this.addapiUrl}`, site ,{ withCredentials: true});
  }

  updateSite(id: number, site: Site): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, site,{ withCredentials: true});
  }

  deleteSite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{ withCredentials: true});
  }
}