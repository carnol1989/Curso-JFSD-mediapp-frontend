import { MenuService } from './../../_service/menu.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/_service/login.service.js';
import { environment } from 'src/environments/environment.js';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import '../../login-animation.js';

@Component({
  selector: 'app-loguin',
  templateUrl: './loguin.component.html',
  styleUrls: ['./loguin.component.css']
})
export class LoguinComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  iniciarSesion() {
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      //console.log(data);

      const helper = new JwtHelperService();
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);

      let decodedToken = helper.decodeToken(data.access_token);
      console.log(decodedToken);

      //subscibe es método asyncrono, para eso el switchMap se puede ejecutar en bloques
      this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
        this.menuService.menuCambio.next(data);//se pasa la data al app.component.ts
        this.router.navigate(['paciente']);
      });
    });
  }

  ngAfterViewInit(): void {
    (window as any).initialize();
  }

}
