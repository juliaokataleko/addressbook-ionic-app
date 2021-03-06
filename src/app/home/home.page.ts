import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/Address';
import { DatabaseService } from '../services/database/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit {

  addresses: Observable<Address[]>;
  loaded = false;

  constructor(private db: DatabaseService) {

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadAddresses();
        this.addresses = this.db.addresses;
        this.loaded = true;
      }
    });
  }


}
