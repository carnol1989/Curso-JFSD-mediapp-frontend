import { Paciente } from './paciente';

export class Signo {
    idSignoVital: number;
    paciente: Paciente;
    fecha: string;
    temperatura: string;
    pulso: string;
    ritmoRespiratorio: string;
}