import { PasswordValidation } from './match';
import { LoginService } from 'src/app/_service/login.service.js';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  form: FormGroup;
  token: string;//la cadena que viene de la url
  mensaje: string;
  error: string;
  rpta: number;
  tokenValido: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: [''],
      confirmPassword: ['']
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.route.params.subscribe((params: Params) => {
      this.token = params['token'];
      this.loginService.verificarTokenReset(this.token).subscribe(data => {
        if (data === 1) {
          this.tokenValido = true;
        } else {
          this.tokenValido = false;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000);
        }
      });
    }, err => {
      //Esto es mejor tratarlo con una clase HttpInterceptor
    });
  }

  onSubmit() {
    let clave: string = this.form.value.confirmPassword;
    this.loginService.restablecer(this.token, clave).subscribe(data => {
      if (data === 1) {
        this.mensaje = 'Se cambio la contraseña.';
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 2000);
      }
    });
  }

}
