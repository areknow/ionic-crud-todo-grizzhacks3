import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

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
    console.log(f.value);
  }

}
