import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConsultaListaExamenDTO } from './../_dto/consultaListaExamenDTO';
import { FiltroConsultaDTO } from './../_dto/filtroConsultaDTO';
import { Consulta } from '../_model/consulta';
import { ConsultaResumenDTO } from './../_dto/consultaResumenDTO';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  url: string = `${environment.HOST}/consultas`;

  constructor(private http: HttpClient) { }

  registrar(consultaDTO: ConsultaListaExamenDTO) {
    return this.http.post(this.url, consultaDTO);
  }

  buscar(filtroConsulta: FiltroConsultaDTO) {
    return this.http.post<Consulta[]>(`${this.url}/buscar`, filtroConsulta);
  }

  listarExamenPorConsulta(idConsulta: number) {
    return this.http.get<ConsultaListaExamenDTO[]>(`${environment.HOST}/consultaExamenes/${idConsulta}`);
  }

  listarResumen() {
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  generarReporte() {
    return this.http.get(`${this.url}/generarReporte`, {
      responseType: 'blob'
    });
  }

  guardarArchivo(data: File) {
    let formData: FormData = new FormData();
    formData.append('adjunto', data);

    return this.http.post(`${this.url}/guardarArchivo`, formData);
  }

  leerArchivo() {
    return this.http.get(`${this.url}/leerArchivo/1`, {
      responseType: 'blob'
    });
  }

}
