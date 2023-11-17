import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/information/information.component';
import { PeopleComponent } from './components/people/people.component';
import { CarsComponent } from './components/cars/cars.component';

const routes: Routes = [
  { path: 'information', component: InformationComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'cars', component: CarsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
