import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { Item } from '../../models/types';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

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
    private afs: AngularFirestore
  ) {
    this.collection = this.afs.collection<Item>('items');
  }

  submitForm(f: NgForm) {
    if (f.value.name) {
      this.collection.add({
        name: f.value.name,
        description: f.value.description
      });
    } else {
      console.log('empty field')
    }
  }

}
