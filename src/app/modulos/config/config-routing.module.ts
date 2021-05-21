import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { DbFormComponent } from './pages/index/pages/databases/components/db-form/db-form.component';
import { DbTableComponent } from './pages/index/pages/databases/components/db-table/db-table.component';
import { DatabasesComponent } from './pages/index/pages/databases/databases.component';
import { ErrorhistoryComponent } from './pages/index/pages/errorhistory/errorhistory.component';
import { NotificationsComponent } from './pages/index/pages/notifications/notifications.component';
import { SystemFormComponent } from './pages/index/pages/systems/components/system-form/system-form.component';
import { SystemTableComponent } from './pages/index/pages/systems/components/system-table/system-table.component';
import { SystemsComponent } from './pages/index/pages/systems/systems.component';
import { WsFormComponent } from './pages/index/pages/webservices/components/ws-form/ws-form.component';
import { WsTableComponent } from './pages/index/pages/webservices/components/ws-table/ws-table.component';
import { WebservicesComponent } from './pages/index/pages/webservices/webservices.component';
import { WFormComponent } from './pages/index/pages/websites/components/w-form/w-form.component';
import { WTableComponent } from './pages/index/pages/websites/components/w-table/w-table.component';
import { WebsitesComponent } from './pages/index/pages/websites/websites.component';
import { MainComponent } from './pages/main/main.component';


const routes: Routes = [
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'index',
    component: IndexComponent,
    children:[
      {
        path:'systems',
        component:SystemsComponent,
        children:[
          {
            path:'add',
            component:SystemFormComponent
          },
          {
            path:'table',
            component:SystemTableComponent
          }
        ]
      },
      {
        path:'websites',
        component:WebsitesComponent,
        children:[
          {
            path:'add',
            component:WFormComponent
          },
          {
            path:'table',
            component:WTableComponent
          },
          {
            path:'table/:systemId',
            component:WTableComponent
          }
        ]
      },
      {
        path:'webservices',
        component:WebservicesComponent,
        children:[
          {
            path:'add',
            component:WsFormComponent
          },
          {
            path:'table',
            component:WsTableComponent
          },
          {
            path:'table/:systemId',
            component:WsTableComponent
          }
        ]
      },
      {
        path:'databases',
        component:DatabasesComponent,
        children:[
          {
            path:'add',
            component:DbFormComponent
          },
          {
            path:'table',
            component:DbTableComponent
          },
          {
            path:'table/:systemId',
            component:DbTableComponent
          }
        ]
      },
      {
        path:'error-history',
        component:ErrorhistoryComponent
      },
      {
        path:'notifications',
        component:NotificationsComponent
      },
      {
        path: '',
        redirectTo: '/config/index/systems',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/config/main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
