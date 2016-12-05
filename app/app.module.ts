import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }   from '@angular/http';
import { AppComponent }  from './components/app.component';
import { TestComponent }    from './components/test.component';
import { UserPanelComponent } from './components/userpanel.component';
import { DashboardComponent } from './components/dashboard.component';
import { RegatasComponent } from './components/regatas.component';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing-module';
import { UserService } from './services/user.service';
import { RegatasService } from './services/regatas.service';
import * as router from '@angular/router';

@NgModule({
  imports:      [ BrowserModule, HttpModule, AppRoutingModule ],
  declarations: [ AppComponent, 
                  TestComponent,
                  UserPanelComponent, 
                  DashboardComponent, 
                  RegatasComponent
                ],
  providers:    [
    RegatasService,
    UserService
  ],
  
  bootstrap:    [ AppComponent ],
})

export class AppModule { }