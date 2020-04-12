import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Paciente } from './../../../_model/paciente';
import { Especialidad } from './../../../_model/especialidad';
import { Medico } from 'src/app/_model/medico';
import { Examen } from 'src/app/_model/examen';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { PacienteService } from 'src/app/_service/paciente.service';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { MatSnackBar, MatStepper } from '@angular/material';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { ConsultaListaExamenDTO } from './../../../_dto/consultaListaExamenDTO';
import { Consulta } from './../../../_model/consulta';
import * as moment from 'moment';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  isLinear = false;
  firstFormGroup : FormGroup;
  secondFormGroup : FormGroup;

  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  medicos: Medico[];
  examenes: Examen[];

  pacienteSeleccionado: Paciente;
  especialidadSeleccionado: Especialidad;
  medicoSeleccionado: Medico;
  examenSeleccionado: Examen;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  consultorios: number[] = [];
  consultorioSeleccionado: number = 0;

  @ViewChild('stepper', {static: true}) stepper: MatStepper;

  constructor(
    private formBuilder : FormBuilder,
    private pacienteService: PacienteService,
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private snackBar: MatSnackBar,
    private consultaService: ConsultaService
  ) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
      'pacienteSeleccionado': new FormControl(),
      'fecha': new FormControl(new Date()),
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')
    });
    
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.listarPacientes();
    this.listarEspecialidades();
    this.listarMedicos();
    this.listarExamenes();
    this.listarConsultorios();
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.value;
  }

  seleccionarMedico(medico: Medico) {
    this.medicoSeleccionado = medico;
  }

  seleccionarEspecialidad(e: any) {
    this.especialidadSeleccionado = e.value;
  }

  seleccionarConsultorio(c: number) {
    this.consultorioSeleccionado = c;
  }

  listarConsultorios() {
    for (let i = 1; i <= 20; i++) {
      this.consultorios.push(i);
    }
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  listarEspecialidades() {
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }

  agregar() {
    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);

      this.diagnostico = null;
      this.tratamiento = null;
    } else {
      this.mensaje = `Debe agregar un diagnóstico y tratamiento`;
      this.snackBar.open(this.mensaje, "Aviso", {
        duration: 2000
      });
    }
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        this.mensaje = 'El examen se encuentra en la lista';
        this.snackBar.open(this.mensaje, "Aviso", {
          duration: 2000
        });
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = 'Debe agregar un examen';
      this.snackBar.open(this.mensaje, "Aviso", {
        duration: 2000
      });
    }
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }

  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionado === null ||
      this.medicoSeleccionado === null || this.pacienteSeleccionado === null);
  }

  registrar() {
    let consulta = new Consulta();
    consulta.especialidad = this.especialidadSeleccionado;
    consulta.medico = this.medicoSeleccionado;
    consulta.paciente = this.pacienteSeleccionado;
    
    consulta.fecha = moment().format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;
    consulta.numConsultorio = `C${this.consultorioSeleccionado}`;    

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrar(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Se registró", "Aviso", {
        duration: 2000
      });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = undefined;
    this.especialidadSeleccionado = undefined;
    this.medicoSeleccionado = undefined;
    this.examenSeleccionado = undefined;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
    this.stepper.reset();
  }

}
