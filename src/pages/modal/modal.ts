import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Item } from '../../models/types';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html'
})
export class ModalPage {

  itemName: string;
  itemDesc: string;
  itemId: string;

  collection: AngularFirestoreCollection<Item>;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    private afs: AngularFirestore,
    public toast: ToastService,
    ) {
    const paramItem = params.get('item');
    this.itemName = paramItem.name;
    this.itemDesc = paramItem.description;
    this.itemId = paramItem.id;

    this.collection = this.afs.collection<Item>('items');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  submitForm(f: NgForm) {
    this.collection.doc(this.itemId).update({
      name: f.value.name,
      description: f.value.description,
    })
    .then(()=> {
      this.viewCtrl.dismiss();
      this.toast.presentToast('Item saved!');
    })
    .catch((error)=> {
      console.log(error);
      this.toast.presentToast('Error saving item');
    });
  }

}