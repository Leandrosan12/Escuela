import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  icono = "oscuro"

  constructor(
    private anim: AnimationController
  ) { }

  ngOnInit() {
    
    this.anim.create()
    .addElement(document.querySelector("#logo")!)
    .duration(2000)
    .iterations(Infinity)
    .direction("alternate")
    .fromTo("color", "#73ECF0", "#DB49FF")
    .fromTo("transform", "scale(1) rotate(-20deg)", "scale(1.4) rotate(20deg)")
    .play()
  }
   cambiarTema() {
      if (this.icono == "oscuro") {
        document.documentElement.style.setProperty("--fondo", "#373737")
        document.documentElement.style.setProperty("--textos", "#ffffff")
        this.icono = "claro"
      } else {
        document.documentElement.style.setProperty("--fondo", "#99aac9")
        document.documentElement.style.setProperty("--textos", "#000000")
        this.icono = "oscuro"
      }
   }
  }
