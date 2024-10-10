import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing ,BarcodeScanner} from '@capacitor-mlkit/barcode-scanning';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  segment = 'scan';
  qrText = 'asistencia';
  scanResult='';
  icono = "oscuro"
  constructor(private loadingController: LoadingController, private platform:Platform,
    private modalController: ModalController

  ) {}
ngOnInit(): void {
  if(this.platform.is('capacitor')){
    BarcodeScanner.isSupported().then();
    BarcodeScanner.checkPermissions().then();
    BarcodeScanner.removeAllListeners();
  }

  
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

async startScan() {
  const modal = await this.modalController.create({
    component: BarcodeScanningModalComponent,
    cssClass: 'barcode-scanning-modal',
    showBackdrop: false,
    componentProps: { 
      formats: [],
      LensFacing: LensFacing.Back
    }
  });

  await modal.present();
  
  const { data } = await modal.onWillDismiss();
  
  if (data) {
    // Obtén el resultado del escaneo
    const scanValue = data?.barcode?.displayValue;
    this.scanResult = scanValue;

    // Supongamos que el código QR contiene un ID de usuario
    const userId = scanValue;

    // Aquí llamas a una función para obtener los detalles del usuario (nombre, apellido)
    const userInfo = await this.getUserDetails(userId);

    // Obtener la fecha y hora actual
    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();

    // Acción realizada
    const accion = "Asistencia tomada";

    // Mostrar la información en consola o UI
    console.log(`Usuario: ${userInfo.nombre} ${userInfo.apellido}`);
    console.log(`Fecha: ${fecha}`);
    console.log(`Hora: ${hora}`);
    console.log(`Acción: ${accion}`);
  }
}

// Función simulada para obtener detalles de usuario según el ID (reemplázala por tu propia lógica)
async getUserDetails(userId: string) {
  // Aquí puedes hacer una llamada a una API o buscar en una base de datos
  return {
    nombre: "Juan",
    apellido: "Pérez"
  };
}


  captureScreen() {
    const element = document.getElementById('qrImage') as HTMLElement;
    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      
      if(this.platform.is('capacitor'))this.shareImagen(canvas);
      else this.downloadImagen(canvas);
    });
  }

  downloadImagen(canvas: HTMLCanvasElement) {
    const link = document.createElement('a');
    link.download = 'qr.png';
    link.href = canvas.toDataURL();
    link.click();
  }
  async shareImagen(canvas: HTMLCanvasElement) {
    let base64 = canvas.toDataURL();
    let path = 'qr.png';

    const loading = await this.loadingController.create({
      spinner: 'crescent',
    });
    await loading.present();

    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,
    })
      .then(async (res) => {
        let uri = res.uri;

        await Share.share({ url: uri });
        await Filesystem.deleteFile({
          path,
          directory: Directory.Cache,
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
