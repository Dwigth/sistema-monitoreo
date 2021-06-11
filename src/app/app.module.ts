import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { DetailsComponent } from './pages/details/details.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SystemInfoComponent } from './pages/main/system-info/system-info.component';
import { ConfigComponent } from './pages/config/config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SidemenuComponent } from './pages/main/sidemenu/sidemenu.component';
import { SnackbarModule } from 'ngx-snackbar';
import { Pipes } from 'src/pipes';

const config: SocketIoConfig = { url: environment.url, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DetailsComponent,
    SystemInfoComponent,
    ConfigComponent,
    SidemenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    SnackbarModule.forRoot(),
    Pipes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
