import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-people-modal',
  templateUrl: './people-modal.component.html'
})
export class PeopleModalComponent implements OnInit {
  @Input() id_people: number | undefined;

  modal = {} as any;
  cars = [] as any;
  age = 0 as any;

  carsSelected(e:any){
    console.log(e);
    console.log(e)
    this.modal.cars = JSON.stringify(e);
  }

  setAge(e:any){
    this.age = this.setAgeWithCnp(e.target.value);
  }

  setAgeWithCnp(cnp:string){

    if (cnp.length !== 13) {return 0}
  
    const anNastere = parseInt(cnp.substring(1, 3), 10);
  
    const secol = parseInt(cnp.charAt(0), 10);
    let secolNastere;
  
    if (secol === 1 || secol === 2) {
      secolNastere = 1900;
    } else if (secol === 3 || secol === 4) {
      secolNastere = 1800;
    } else if (secol === 5 || secol === 6) {
      secolNastere = 2000;
    } else {
      return 0;
    }
  
    const anComplet = secolNastere + anNastere;
    const anCurent = new Date().getFullYear();
    const varsta = anCurent - anComplet;
  
    return varsta;
  }

  checkAreValidateAllFields(): boolean {
    
    console.log(this.modal)

    //verifica daca obiectul este empty, nu s-a introdus nicio informatie 
    if (Object.keys(this.modal).length === 0) {return false}

    //lungimea 2 pentru ca am avut o colega de munca pe care o chema 'HA' :))
    if(this.modal.name){
      if(this.modal.name.length < 2){
        this.toastr.error('Introduceti Nume');
        return false;
      }
    }else{
      this.toastr.error('Introduceti Nume');
      return false;
    }
    
    if(this.modal.surname){
      if(this.modal.surname.length < 2){
        this.toastr.error('Introduceti Prenume');
        return false;
       }
    }else{
      this.toastr.error('Introduceti Prenume');
      return false;
    }

    if(this.modal.ssn){
      if(parseInt(this.modal.ssn.toString().charAt(0), 10) <= 0 || parseInt(this.modal.ssn.toString().charAt(0), 10) > 6){
        this.toastr.error('CNP-ul nu este valid. Prima cifră trebuie să fie între 1 și 6');
        return false;
      }
      if(this.modal.ssn.toString().split('').length != 13){
        this.toastr.error('Introduceti CNP format din 13 cifre');
        return false;
      }
    }else{
      this.toastr.error('Introduceti CNP format din 13 cifre');
      return false;
    }
    
    if(this.modal.cars){
      if(this.modal.cars.length === 0){
        this.toastr.error('Alegeti masina');
        return false;
      }
   }else{
      this.toastr.error('Alegeti masina');
      return false;
   }
   return true;
  }

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.loadDataPeople();
    this.loadDataCar();
  }

  loadDataCar = (): void => {
    this._spinner.show();
    axios.get(`/api/cars`).then(({ data }) => {
      this.cars = data.map((car: { id:any; brend: any; model: any; year: any; engine: any; tax: any;})=>{
        return {id:car.id, data:car.brend+'/'+car.model+'/'+car.engine+'/'+car.year+'/'+car.tax};
      })

      this._spinner.hide();
      console.log('this.modal 1 ', data)
    }).catch(() => this.toastr.error('Eroare la preluarea informației cars!'));
  }

  loadDataPeople = (): void => {
    if (this.id_people) {
      this._spinner.show();
      axios.get(`/api/people/${this.id_people}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
        console.log('this.modal 1 ', this.modal)
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));

      
    }
  }

  save(): void {
    if(!this.checkAreValidateAllFields()) return;

    this._spinner.show();
    console.log('this.modal 2 ', this.modal)
    if (!this.id_people) {
      axios.post('/api/people', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/people', this.modal).then(() => {
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
