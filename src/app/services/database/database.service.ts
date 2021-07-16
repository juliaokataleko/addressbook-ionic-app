import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  addresses = new BehaviorSubject([]);
  properties = new BehaviorSubject([]);

  address = {};

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private plt: Platform, 
    private sqlitePorter: SQLitePorter, 
    private sqlite: SQLite, 
    private http: HttpClient) { 

      this.plt.ready().then(() => {
        let db_open = this.sqlite.create({
          name: 'address_book.db',
          location: 'default'
        });    

        console.log(db_open);
        
        if(db_open) {
          db_open.then((db: SQLiteObject) => {
              this.database = db;
              this.seedDatabase();
          });
        }        

        return db_open;

      });

  }

  seedDatabase() {
    this.http.get('assets/database.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.loadAddresses();
          this.loadProperties();
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  } 

  getAdds(): Observable<Address[]> {
    return this.addresses.asObservable();
  }
 
  getProps(): Observable<any[]> {
    return this.properties.asObservable();
  }

  loadAddresses() {
    return this.database.executeSql('SELECT * FROM addresses', []).then(data => {
      const addresses = [];
 
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          
          addresses.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name, 
            data: data.rows.item(i).data, 
            classe: data.rows.item(i).classe, 
            activityNiche: data.rows.item(i).activity_niche, 
            propertyType: data.rows.item(i).property_type, 
            description: data.rows.item(i).description, 
            followUpStart: data.rows.item(i).follow_up_start, 
            followUpEnd: data.rows.item(i).follow_up_end, 
           });

        }
      }

      this.addresses.next(addresses);
    });
  }

  loadProperties() {
    return this.database.executeSql('SELECT * FROM properties', []).then(data => {
      
      let props = [];
 
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          
          props.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name, 
           });
        }
      }

      this.properties.next(props);

    });
  }

  addAddress(data) {
    return this.database.executeSql(`INSERT INTO addresses 
    (name, data, activity_niche, classe, porperty_type, description, 
      follow_up_start, follow_up_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, data).then(data => {
      // this.loadProducts();
      console.log(data);
    });
  }

  editAddress(data) {
    return this.database.executeSql(`UPDATE addresses set name = ?, data = ?, 
    activity_niche = ?, classe = ?, porperty_type = ?, 
    description = ?, follow_up_start = ?, follow_up_end = ? 
    WHERE id = ${data.id}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, data).then(data => {
      // this.loadProducts();
      console.log(data);
    });
  }

}
