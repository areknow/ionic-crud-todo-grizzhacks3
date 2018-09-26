# ionic-crud-todo-grizzhacks3

Grizzhacks 3 live coding demo documentation


## Setup

- open terminal in IDE
- godev
- ionic start grizzhacks sidemenu
- open grizzhacks directory
- ionic serve
- change root page to “ListPage” in app component 
- change menu order in app component 
- rename “home” page to “add”. rename all references in ts, app component, and app module
- change html of “add” page



## Firebase console: https://console.firebase.google.com/

- add project “grizzhacks”
- click on database in side menu
- click on create database “start in test mode”
- go to project settings “gear icon”
- “add firebase to web app”



## Add firestore

- install firestore `angularfire2` `firebase`
- install `npm i rxjs@^6.0 rxjs-compat` because ionic is not fully compatible with ng6 yet
- create environments folder in  /src
- create a env.ts file, add:

```javascript
// note: these credentials are not valid. use your own
export const env = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBBN6BENXlZmBd4g5SoxMr-lVmBLWW0nT4",
    authDomain: "grizzhacks-c8d19.firebaseapp.com",
    databaseURL: "https://grizzhacks-c8d19.firebaseio.com",
    projectId: "grizzhacks-c8d19",
    storageBucket: "grizzhacks-c8d19.appspot.com",
    messagingSenderId: "498735462221"
  }
};
```

- in app module add:

```typescript
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { env } from '../environments/env';
```

```typescript
// imports: 
AngularFireModule.initializeApp(env.firebase),
AngularFirestoreModule,
```

- rebuild may be needed



## Add form inputs

- go to ionic components docs 
- copy the inputs > floating label source, rename the labels
- put a block button inside of a div with a class, use the class in the css to add top margin (60)
- add form element wrapper and `#form="ngForm" (ngSubmit)="submitForm(form)"` to form
- add "name" attribute to the inputs
- `import { NgForm } from '@angular/forms';`
- add instance vars to class, and bind to `[(ngModel)]` in template

```typescript
itemName: string;
itemDesc: string = "";
```

- demonstrate that the values are being captured in the method
- add a conditional null check: no need to check description value since it may be empty

```javascript
if (f.value.name) {
  console.log(f.value);
} else {
  console.log('empty field')
}
```



## Add a document to the DB

- `import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';`
- create item type: make `models` dir in /src, create `types.ts`, add: 

```typescript
export interface Item {
  name: string;
  description: string;
}
```

- import type into the class: `import { Item } from '../../models/types';` 
- create class instance `collection: AngularFirestoreCollection<Item>;`
- add `private afs: AngularFirestore,` to the constructor args 
- add `this.collection = this.afs.collection<Item>('items');`  to the constructor method
- add the `.add()` function to save data: 

```typescript
this.collection.add({
  name: f.value.name,
  description: f.value.description
});
```

- now adding a document should show up in the firebase console (possible rebuild)
- add error handling for `.add()`

```typescript
.then(()=> {

})
.catch((error)=> {
  console.log(error);
});
```

- add toast from component lib and create toast function, modify to use variable message, remove onDidDismiss
- clear form after successfull save `this.itemName = '';  this.itemDesc = '';`
- add navigation to list page after save `this.navCtrl.push(ListPage);` import the page `import { ListPage } from '../list/list';`
- add toast to the else to handle missing name



## Retrieve / remove documents from the DB

- clean html and ts file from list page
- `import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';`
- import type
- add to class: 

```typescript
collection: AngularFirestoreCollection<Item>;
items$: Observable<Item[]>;
```

- add to constructor args: `private afs: AngularFirestore`
- add to constructor method: 

```typescript
this.collection = this.afs.collection<Item>('items');
this.items$ = this.collection.snapshotChanges().map(actions => {
  return actions.map(a => {
    const data = a.payload.doc.data() as Item;
    const id = a.payload.doc.id;
    return { id, ...data };
  });
});
```

- import rxjs

```typescript
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
```

- add a ngfor item list in template:

```html
<ion-item class="list-item" *ngFor="let item of items$ | async">
  <div>{{ item.name }}</div>
  <div class="desc">{{ item.description }}</div>
</ion-item>
```

- add css to list-item for subtext and main text: 

```scss
.list-item {
  font-size: 20px;
  .desc {
    font-size: 12px;
    color: grey;
  }
}
```

- clear db and demonstrate functionality 
- add a close icon from the component library, use `item-right` to align it: `<ion-icon name="close" item-right></ion-icon>`
- add a click action to the icon and pass in the ID to a `removeItem()` function, then log the ID to demonstrate
- import the alert controller (confirmation) from the ionic docs. put code in the` removeItem()` function
- add the doc delete funciton in the remove handler `this.collection.doc(id).delete();`
- show a toast when an item is deleted 



## Fix out of order items with an angular pipe

- modify types to add 'time' with type 'string'
- add a new key to the add function in add.ts: `time: String(+ new Date())`
- clear DB and show that time stamp is now being saved
- create a new pipe dir, and new pipe file 'date-sort.ts'

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSort'
})

export class DateSortPipe implements PipeTransform {
  transform(value) {

    if (!value) return;

    let val = value.sort((a: any, b: any) => {

      if (a.time < b.time) {
        return 1;
      } else if (a.time > b.time) {
        return -1;
      } else {
        return 0;
      }
    });

    return val;
  }
}
```

- import and register the pipe in the app module in declarations 
- add the pipe into the ngfor template `async | dateSort`
- possible rebuild needed



## Add editing capabilities with a modal

- add click action to item name in list view, pass in the item reference to a method `editItem(item)`
- create the method in ts
- get the modalController code from docs 
- import the modal controller, add to constructor args, 
- generate a new page `ionic generate page Modal --no-module` 
- register the page in the app module 
- import the modal component and add the modal presentation code into the  `editItem()` method

```typescript
let editModal = this.modalCtrl.create(ModalPage, { item: item });
editModal.present();
```

- clean up modal html and ts and fill out the rest from below: 
- modal.ts

```typescript
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
```

- modal.html

```html
<ion-header>
  <ion-navbar>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">Close</button>
    </ion-buttons>
    <ion-title>Edit</ion-title>
  </ion-navbar>
</ion-header>

<ion-content>
  modal content
</ion-content>
```

- now we need to copy the form html from the add page to the modal page
- then add class instances for form variables in modal ts

```typescript
itemName: string;
itemDesc: string;
itemId: string;
```

- then pass the param values to the class instances within the constructor

```typescript
const paramItem = params.get('item');
this.itemName = paramItem.name;
this.itemDesc = paramItem.description;
this.itemId = paramItem.id;
```

- demonstrate the form getting filled with values 
- create `submitForm(f: NgForm)` function and import ng-form
- import firestore `import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';`
- make the collection instance  `collection: AngularFirestoreCollection<Item>;` 
- add to constructor args `private afs: AngularFirestore,`
- initialize the collection within the constructor `this.collection = this.afs.collection<Item>('items');`
- import the `Item` type 
- add the code to update a document 

```typescript
this.collection.doc(this.itemId).update({
  name: f.value.name,
  description: f.value.description,
});
```

- demonstrate editing a document
- set up the confirmation and error toasts (copy from add.ts)
- dismiss the modal on success 



## Add item count to header

- create a class instance var `itemCount: number;`
- add ` ({{ itemCount }})` to the page ion-title
- create a subscription to $items

```typescript
this.items$.subscribe((data: any) => {
  this.itemCount = data.length;
}, (error: any) => console.log(error));
```

