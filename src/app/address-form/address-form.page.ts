import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, NavParams } from '@ionic/angular';

import { Observable } from 'rxjs';
import { DatabaseService } from '../services/database/database.service';
import { Address } from '../models/Address';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.page.html',
  styleUrls: ['./address-form.page.scss'],
})
export class AddressFormPage implements OnInit {

  title = 'Cadastrar Endereço';
  loaded = false;

  address: Address = {
    id: null,
    name: '',
    data: new Date('01-01-2000').toISOString(),
    classe: '',
    activityNiche: '',
    propertyType: '',
    description: '',
    followUpStart: new Date('01-01-2000').toISOString(),
    followUpEnd: new Date('02-01-2000').toISOString(),
  };

  errors: string;
  properties: Observable<any[]>;

  constructor(public router: Router,
    private route: ActivatedRoute, 
    public alertController: AlertController,
    private db: DatabaseService
    ) {
      this.db.getDatabaseState().subscribe(rdy => {
        // this.presentAlert('Conexão...' + this.db.ok_db + ' - erro: ' + this.db.error);
        if (rdy) {
          this.properties = this.db.getProps();

          // Check if there is a id
          this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if(id) {
              this.title = 'Editar endereço';
              this.address.id = Number(id);

              this.db.getAddress(this.address.id).then(data => {
                this.address = data;
              });

            }
          });

          this.loaded = true;

        } else {
          // this.presentAlert('O banco de dados não foi carregado...' + rdy);
        }

      });
    }

  ngOnInit() {
  }

  goHome() {
    this.router.navigateByUrl('/home');
  }

  addAddress() {
    // checking for empty values
    this.errors = '';

    this.validateForm();

    if(this.errors) {
      // show alert
      this.presentAlert(this.errors);
    } else {
      // add address in database

      const data = [];
      data[0] = this.address.name;
      data[1] = this.address.data;
      data[2] = this.address.activityNiche;
      data[3] = this.address.classe;
      data[4] = this.address.propertyType;
      data[5] = this.address.description;
      data[6] = this.address.followUpStart;
      data[7] = this.address.followUpEnd;

      this.db.addAddress(data);

      this.alertSuccess();
    }
  }

  updateAddress() {
    // checking for empty values
    this.errors = '';

    this.validateForm();

    if(this.errors) {
      // show alert
      this.presentAlert(this.errors);
    } else {
      // update address in database

      const data = [];
      data[0] = this.address.name;
      data[1] = this.address.data;
      data[2] = this.address.activityNiche;
      data[3] = this.address.classe;
      data[4] = this.address.propertyType;
      data[5] = this.address.description;
      data[6] = this.address.followUpStart;
      data[7] = this.address.followUpEnd;

      this.db.updateAddress(data,this.address.id);

      this.alertSuccess();
    }
  }

  validateForm() {

    if(this.address.name == '') 
      this.errors = this.errors + 'Por favor preencha o nome.';

  }

  async alertSuccess() {

    const saved = await this.alertController.create({
      header: 'Parabéns!!',
      message: 'Endereço salvo com sucesso.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {

            // reset address data
            this.resetAddressData();

            // Redirect to home
            this.goHome();
          },
        }
      ],
    });

    await saved.present();

  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Atenção!!',
      // subHeader: 'Subtitle',
      message: message,
      buttons: ['Fechar']
    });
    await alert.present();
  }

  resetAddressData() {
    return this.address = {
      id: null,
      name: '',
      data: '',
      classe: '',
      activityNiche: '',
      propertyType: '',
      description: '',
      followUpStart: '',
      followUpEnd: ''
    };
  }

}
