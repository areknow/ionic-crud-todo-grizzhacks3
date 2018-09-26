import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html'
})
export class ModalPage {

  itemName: string;
  itemDesc: string;
  itemId: string;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    const paramItem = params.get('item');
    this.itemName = paramItem.name;
    this.itemDesc = paramItem.description;
    this.itemId = paramItem.id;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}