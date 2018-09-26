import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { Item } from '../../models/types';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ListPage } from '../list/list';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {

  itemName: string;
  itemDesc: string = '';

  collection: AngularFirestoreCollection<Item>;

  constructor(
    public navCtrl: NavController,
    private afs: AngularFirestore,
    public toast: ToastService
  ) {
    this.collection = this.afs.collection<Item>('items');
  }

  submitForm(f: NgForm) {
    if (f.value.name) {
      this.collection.add({
        name: f.value.name,
        description: f.value.description,
        time: String(+ new Date())
      })
      .then(()=> {
        this.itemName = '';  
        this.itemDesc = '';
        this.toast.presentToast('Item saved!');
        this.navCtrl.push(ListPage);
      })
      .catch((error)=> {
        console.log(error);
        this.toast.presentToast('Error saving item');
      });
    } else {
      this.toast.presentToast('Please enter item name');
    }
  }

}
