import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './pages/details/details.component';
import { MainComponent } from './pages/main/main.component';


const routes: Routes = [
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
