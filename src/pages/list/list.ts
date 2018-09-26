import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { Item } from '../../models/types';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ModalPage } from '../modal/modal';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  collection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;

  itemCount: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afs: AngularFirestore,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toast: ToastService
    ) {
    this.collection = this.afs.collection<Item>('items');

    this.items$ = this.collection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });

    this.items$.subscribe((data: any) => {
      this.itemCount = data.length;
    }, (error: any) => console.log(error));
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
            this.toast.presentToast('Item removed');
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

}
