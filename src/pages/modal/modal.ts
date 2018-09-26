import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html'
})
export class ModalPage {

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    console.log(params.get('item'));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}