import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { DatabaseService } from '../services/database/database.service';

interface Address {
  id?: number;
  name: string;
  data: string;
  classe: string;
  activityNiche: string;
  propertyType: string;
  description: string;
  followUpStart: string;
  followUpEnd: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  addresses: Address[] = [];
  properties: Observable<any[]>;

  adds = [
    {
      id: 1,
      name: "Rua de São Paulo"
    },
    {
      id: 2,
      name: "Rua de São Pedro"
    },
    {
      id: 1,
      name: "Rua de São Tomás"
    }
  ];

  propers = [
    {name: "Privado"},
    {name: "Privado"}
  ]

  constructor(private db: DatabaseService) {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getAdds().subscribe(adds => {
          this.addresses = adds;
          console.log('devs changed .. ' + adds);
        });

        this.properties = this.db.getProps();
        
      }
    });
  }

}
