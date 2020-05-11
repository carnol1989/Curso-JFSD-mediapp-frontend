import { Rol } from './../../_model/rol';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  nombre_usuario: string = '';
  roles: any[] = [];

  constructor(

  ) { }

  ngOnInit() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(token);
    this.nombre_usuario = decodedToken.user_name;
    this.roles = decodedToken.authorities;
  }

}
