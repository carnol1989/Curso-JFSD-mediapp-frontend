import { Component, OnInit, Inject } from '@angular/core';
import { Consulta } from './../../../_model/consulta';
import { ConsultaListaExamenDTO } from './../../../_dto/consultaListaExamenDTO';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConsultaService } from './../../../_service/consulta.service';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent implements OnInit {

  consulta: Consulta;
  examenes: ConsultaListaExamenDTO[];

  constructor(
    private dialogRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private consultaService: ConsultaService
  ) { }

  ngOnInit() {
    this.consulta = this.data;
    this.listarExamenes();
  }

  listarExamenes() {
    this.consultaService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe(data => {
      this.examenes = data;
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

}
