import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ModalController } from 'ionic-angular';

import { Item } from '../../models/types';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ModalPage } from '../modal/modal';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  collection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afs: AngularFirestore,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
    ) {
    this.collection = this.afs.collection<Item>('items');

    this.items$ = this.collection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  removeItem(id) {
    const confirm = this.alertCtrl.create({
      title: 'Remove item?',
      message: 'Do you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.collection.doc(id).delete();
            this.presentToast('Item removed');
          }
        }
      ]
    });
    confirm.present();
  }

  editItem(item) {
    const modal = this.modalCtrl.create(ModalPage, { item: item });
    modal.present();
  }

  presentToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
