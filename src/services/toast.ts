import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()

export class ToastService {

  constructor(
    public toastCtrl: ToastController
  ) {}

  presentToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
