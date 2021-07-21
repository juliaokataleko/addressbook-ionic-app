import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from 'src/app/models/Address';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  addresses = new BehaviorSubject([]);
  properties = new BehaviorSubject([]);

  address = {};
  property = {};

  public ok_db = 0;
  public error: string = "";
  public inserted = 0;
  public database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private plt: Platform, 
    private sqlitePorter: SQLitePorter, 
    private sqlite: SQLite, 
    private http: HttpClient) { 

    this.plt.ready().then(() => {
      this.sqlite.create({
          name: 'addresses.db',
          location: 'default'
      }).then((db: SQLiteObject) => {
            this.database = db;
            this.seedDatabase();
        });
    }); 
  }

  seedDatabase() {
    this.http.get('assets/database.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.ok_db = 1;
          this.loadAddresses();
          this.loadProperties();
          this.dbReady.next(true);
        })
        .catch(e => {
          // console.error(e);
          // this.error = JSON.stringify(e);
        });
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
    return this.database.executeSql('INSERT INTO addresses (name, data, activity_niche, classe, property_type, description, follow_up_start, follow_up_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadAddresses();
      this.inserted = 1;
    }).catch(e => {
      // console.error(e);
      this.error = JSON.stringify(e);
    });
  }

  getAddress(id): Promise<Address> {
    return this.database.executeSql('SELECT * FROM addresses WHERE id = ?', [id]).then(data => {

      if(data.rows) {

        return {
          id: data.rows.item(0).id,
          name: data.rows.item(0).name, 
          data: data.rows.item(0).data, 
          classe: data.rows.item(0).classe, 
          activityNiche: data.rows.item(0).activity_niche, 
          propertyType: data.rows.item(0).property_type, 
          description: data.rows.item(0).description, 
          followUpStart: data.rows.item(0).follow_up_start, 
          followUpEnd: data.rows.item(0).follow_up_end, 
        };

      }

      return null;

    });
  }

  updateAddress(data, id) {
    return this.database.executeSql(`UPDATE addresses SET name = ?, data = ?, activity_niche = ?, classe = ?, property_type = ?, description = ?, follow_up_start = ?, follow_up_end = ? WHERE id = ${id}`, data).then(data => {
      
    });
  }

}
