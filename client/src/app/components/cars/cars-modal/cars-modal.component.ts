import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cars-modal',
  templateUrl: './cars-modal.component.html'
})

export class CarsModalComponent implements OnInit {
  @Input() id_carInformation: number | undefined;
  
  modal = {} as any;
  taxa = 0 as any;

  setCostTax(e:any){
    let engine = Number(e.target.value);
    if(engine <= 1500)  this.taxa = 50;
    if(engine > 1500 && engine <= 2000)  this.taxa = 100;
    if(engine > 2000)  this.taxa = 200;

    this.modal.tax = this.taxa;
  } 

  checkAreValidateAllFields(): boolean {
    
    console.log(this.modal)

    //verifica daca obiectul este empty, nu s-a introdus nicio informatie 
    if (Object.keys(this.modal).length === 0) {return false}

    //lungimea 2 pentru ca Kia este cel mai scurt nume de brand pentru masina
    if(this.modal.brend){
      if(this.modal.brend.length < 2){
        this.toastr.error('Introduceti o marca de masina valida');
        return false;
      }
    }else{
      this.toastr.error('Introduceti o marca de masina');
      return false;
    }
    
    if(this.modal.model){
      if(this.modal.model.length < 2){
        this.toastr.error('Introduceti un model de masina valida');
        return false;
       }
    }else{
      this.toastr.error('Introduceti modelul masinii');
      return false;
    }

    if(this.modal.year){
      const dataCurenta = new Date();
      const anulCurent = dataCurenta.getFullYear();
      
      if(this.modal.year.toString().split('').length != 4 || parseInt(this.modal.year) > anulCurent){
        this.toastr.error('Introduceti un an valid');
        return false;
      }
    }else{
      this.toastr.error('Introduceti anul masinii');
      return false;
    }
    
    if(this.modal.engine){
      if(this.modal.engine.toString().split('').length != 4){
        this.toastr.error('Introduceti o capacitate cilindrica valida');
        return false;
      }
   }else{
      this.toastr.error('Introduceti o capacitate cilindrica');
      return false;
   }
   return true;
  }

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_carInformation) {
      this._spinner.show();
      axios.get(`/api/cars/${this.id_carInformation}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));
    }
  }

  save(): void {
    if(!this.checkAreValidateAllFields()) return;

    this._spinner.show();

    if (!this.id_carInformation) {
      axios.post('/api/cars', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/cars', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la modificarea informației!'));
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter(t => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }
}
