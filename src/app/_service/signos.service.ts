import { environment } from 'src/environments/environment.js';
import { Subject } from 'rxjs';
import { Signo } from './../_model/signo';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignosService {

  signoCambio = new Subject<Signo[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/signos`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Signo[]>(this.url);
  }
  
  listarPageable(page: number, size: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${page}&size=${size}`);
  }

  listarPorId(idSignoVital: number) {
    return this.http.get<Signo>(`${this.url}/${idSignoVital}`);
  }

  registrar(signo: Signo) {
    return this.http.post(this.url, signo);
  }

  modificar(signo: Signo) {
    return this.http.put(this.url, signo);
  }

  eliminar(idSignoVital: number) {
    return this.http.delete(`${this.url}/${idSignoVital}`);
  }
}
