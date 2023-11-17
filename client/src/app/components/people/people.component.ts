import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PeopleModalComponent } from './people-modal/people-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  people: any = [];
  listCars: any = [];

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/people').then(({ data }) => {
      this.people = data;
      for (const key in this.people) {
        this.people[key].cars = JSON.parse(data[key].cars);
      }
      this._spinner.hide();
      console.log('this.people:', data, this.people[0].cars)
    }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
  }

  addEdit = (id_people?: number): void => {
    const modalRef = this._modal.open(PeopleModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_people = id_people;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (people: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți informația având tipul <b>${people.type}</b>, denumirea: <b>${people.name}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/people/${people.id}`).then(() => {
        this.toastr.success('Informația a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ștergerea informației!'));
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-people')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-people', 0);
    this.limit = 70;
  }
}
