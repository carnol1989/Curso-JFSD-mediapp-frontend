import { PacienteDialogoComponent } from './../../paciente/paciente-dialogo/paciente-dialogo.component';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MatDialog } from '@angular/material';
import { Paciente } from './../../../_model/paciente';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Signo } from './../../../_model/signo';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SignosService } from 'src/app/_service/signos.service';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {
  
  form: FormGroup;
  myControlPaciente: FormControl = new FormControl();

  id: number;
  signo: Signo;  
  pacientes: Paciente[];
  pacienteSeleccionado: Paciente;
  fechaSeleccionada: Date = new Date();
  temperatura: string;
  pulso: string;
  ritmoRespiratorio: string;

  pacienteCambioFiltrado = new Subject<Paciente[]>();
  pacientesFiltrados: Observable<any[]>;
  edicion: boolean = false;

  constructor(
    private signoService: SignosService,
    private dialog: MatDialog,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('SignosEdicionComponent: ngOnInit');

    this.signo = new Signo();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });

    //Variable reactiva, reacciona si realizan next en otro lado
    this.pacienteService.pacienteCambio.subscribe(data => {
      this.listarPacientes();
      this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    });

    this.listarPacientes();
    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    console.log('SignosEdicionComponent: initForm');
    if (this.edicion) {
      this.signoService.listarPorId(this.id).subscribe(data => {
        let id = data.idSignoVital;
        let paciente = data.paciente;
        this.myControlPaciente = new FormControl(paciente);
        let fecha = data.fecha;
        let temperatura = data.temperatura;
        let pulso = data.pulso;
        let ritmoRespiratorio = data.ritmoRespiratorio;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'paciente': this.myControlPaciente,
          'fecha': new FormControl(fecha),
          'temperatura': new FormControl(temperatura),
          'pulso': new FormControl(pulso),
          'ritmoRespiratorio': new FormControl(ritmoRespiratorio)
        });
      });
    }
  }

  abrirDialogo(paciente?: Paciente) {
    console.log('SignosEdicionComponent: abrirDialogo');
    let pac = paciente != null ? paciente : new Paciente();
    this.dialog.open(PacienteDialogoComponent, {
      width: '250px',
      data: pac
    });
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) ||
        option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) ||
        option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) ||
        option.apellidos.toLowerCase().includes(val.toLowerCase()) ||
        option.dni.includes(val));
    }
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  changeEvent(event){
    this.fechaSeleccionada = event.value;
  }

  operar() {
    console.log('SignosEdicionComponent: operar');
    this.signo.idSignoVital = this.form.value['id'];
    this.signo.paciente = this.form.value['paciente'];
    this.signo.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    this.signo.temperatura = this.form.value['temperatura'];
    this.signo.pulso = this.form.value['pulso'];
    this.signo.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];

    if (this.signo != null && this.signo.idSignoVital > 0) {
      console.log('SignosEdicionComponent: modificar');
      //BUENA PRACTICA
      this.signoService.modificar(this.signo).pipe(switchMap(() => {
        return this.signoService.listar();
      })).subscribe(data => {
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next('Se modificó');
      });
    } else {
      console.log('SignosEdicionComponent: registrar');
      //PRACTICA COMUN
      this.signoService.registrar(this.signo).subscribe(data => {
        this.signoService.listar().subscribe(signoData => {
          this.signoService.signoCambio.next(signoData);
          this.signoService.mensajeCambio.next('Se registro');
        })
      });
    }

    this.router.navigate(['signos']);
  }

}
