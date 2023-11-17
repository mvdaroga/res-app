import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html'
})
export class InformationModalComponent implements OnInit {
  @Input() id_information: number | undefined;

  modal = {} as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_information) {
      this._spinner.show();
      axios.get(`/api/information/${this.id_information}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));
    }
  }

  save(): void {
    this._spinner.show();

    if (!this.id_information) {
      axios.post('/api/information', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/information', this.modal).then(() => {
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
