import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, NavParams } from '@ionic/angular';

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
  selector: 'app-address-form',
  templateUrl: './address-form.page.html',
  styleUrls: ['./address-form.page.scss'],
})

export class AddressFormPage implements OnInit {

  title = 'Cadastrar Endereço';
  address: Address = {
    id: null,
    name: '',
    data: '',
    classe: '',
    activityNiche: '',
    propertyType: '1',
    description: '',
    followUpStart: '',
    followUpEnd: ''
  };

  errors: string;

  constructor(public router: Router,
    private route: ActivatedRoute, 
    public alertController: AlertController,
    ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if(id) {
        this.title = "Editar endereço";
        this.address.id = Number(id);
      }    
   });
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
      this.presentAlert();
    } else {
      // add address in database
    }
  }

  updateAddress() {
    // checking for empty values
    this.errors = '';

    this.validateForm();

    if(this.errors) {
      // show alert
      this.presentAlert();
    } else {
      // update address in database
    }
  }

  validateForm() {

    if(this.address.name == '') 
    this.errors = this.errors + "Por favor preencha o nome.<br><br>";

    if(this.address.classe == '') 
      this.errors = this.errors + "Por favor preencha a classe.<br><br>";

    if(this.address.propertyType == '') 
      this.errors = this.errors + "Por favor selecione o tipo de propriedade.<br><br>";

    if(this.address.data == '') 
      this.errors = this.errors + "Por favor preencha a data.<br><br>";

    if(this.address.followUpStart == '') 
      this.errors = this.errors + "Por favor preencha a data de início de acompanhamento.<br><br>";

    if(this.address.followUpEnd == '') 
      this.errors = this.errors + "Por favor preencha a data de término de acompanhamento.<br><br>";

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Atenção!!',
      // subHeader: 'Subtitle',
      message: this.errors,
      buttons: ['Fechar']
    });
    await alert.present();
  }

}
