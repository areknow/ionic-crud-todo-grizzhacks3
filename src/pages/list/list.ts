import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/types';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

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
    private afs: AngularFirestore
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
    this.collection.doc(id).delete();
  }

}
