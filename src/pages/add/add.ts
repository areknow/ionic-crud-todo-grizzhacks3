import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {

  itemName: string;
  itemDesc: string = '';

  constructor(public navCtrl: NavController) {

  }

  submitForm(f: NgForm) {
    if (f.value.name) {
      console.log(f.value);
    } else {
      console.log('empty field')
    }
  }

}
