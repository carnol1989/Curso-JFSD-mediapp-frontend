import { SignosEdicionComponent } from './../../signos/signos-edicion/signos-edicion.component';
import { switchMap } from 'rxjs/operators';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Paciente } from './../../../_model/paciente';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente: Paciente;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log('PacienteDialogoComponent: ngOnInit');
    this.paciente = new Paciente();
    this.paciente.idPaciente = this.data.idPaciente;
    this.paciente.nombres = this.data.nombres;
    this.paciente.apellidos = this.data.apellidos;
    this.paciente.dni = this.data.dni;
    this.paciente.direccion = this.data.direccion;
    this.paciente.telefono = this.data.telefono;
    this.paciente.email = this.data.email;
  }

  operar() {
    console.log('PacienteDialogoComponent: operar');
    if (this.paciente != null && this.paciente.idPaciente > 0) {
      console.log('PacienteDialogoComponent: modificar');
      //MODIFICAR
      this.pacienteService.modificar(this.paciente).pipe(switchMap( () => {
        return this.pacienteService.listar();
      })).subscribe(data => {
        this.pacienteService.pacienteCambio.next(data);
        this.pacienteService.mensajeCambio.next('SE MODIFICO');
      });
    } else {
      console.log('PacienteDialogoComponent: registrar');
      //REGISTRAR
      this.pacienteService.registrar(this.paciente).pipe(switchMap( () => {
        return this.pacienteService.listar();
      })).subscribe(data => {
        this.pacienteService.pacienteCambio.next(data);
        this.pacienteService.mensajeCambio.next('SE REGISTRO');        
      });
    }
    
    this.dialogRef.close();
    this.router.navigate(['signos/nuevo']);
  }

  cancelar() {
    this.dialogRef.close();
  }

}
