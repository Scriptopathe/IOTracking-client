import { NgModule }                   from '@angular/core';
import { BrowserModule }              from '@angular/platform-browser';
import { HttpModule }                 from '@angular/http';
import { RouterModule, Routes }       from '@angular/router';
import { FormsModule }                from '@angular/forms';
import { AppRoutingModule }           from './app-routing-module';

import { AppComponent }               from './components/app.component';
import { TestComponent }              from './components/test.component';
import { UserPanelComponent }         from './components/userpanel.component';
import { DashboardComponent }         from './components/dashboard.component';
import { DeviceDashboardComponent }   from './components/devices-dashboard.component';
import { RegatasComponent }           from './components/regatas.component';
import { RegataEditionComponent }     from './components/regata.edit.component';
import { RegataExplorerComponent }    from './components/regata-explorer.component';
import { RacePlayerComponent }        from './components/race-player.component';
import { RegataViewComponent }        from './components/regata-view.component'
import { DeviceListComponent }        from './components/devices-list.component'
import { RaceComponent }              from './components/race.component';
import { RaceViewComponent }          from './components/race-view.component';
import { SliderComponent }            from './components/ui/slider.component';
import { BreadcumbComponent }         from './components/ui/breadcumb.component';
import { RegataFullViewComponent }    from './components/regata-fullview.component';

import { UserService }                from './services/user.service';
import { RegatasService }             from './services/regatas.service';
import { RegatasNewService }          from './services/regatas-new.service';
import { DevicesService }             from './services/devices.service';
import { RaceService }                from './services/race.service';
import { RacerComponent }             from './components/racer.component';     

import * as router from '@angular/router';

@NgModule({
  imports:      [ BrowserModule, HttpModule, AppRoutingModule, FormsModule ],
  declarations: [ AppComponent, 
                  TestComponent,
                  UserPanelComponent, 
                  DashboardComponent, 
                  RegatasComponent,
                  RegataViewComponent,
                  DeviceListComponent,
                  DeviceDashboardComponent,
                  RegataFullViewComponent,
                  RegataEditionComponent,
                  RaceComponent,
                  RacePlayerComponent,
                  SliderComponent,
                  BreadcumbComponent,
                  RaceViewComponent,
                  RegataExplorerComponent,
                  RacerComponent
                ],
  providers:    [
    RegatasService,
    RegatasNewService,
    DevicesService,
    UserService,
    RaceService
  ],
  
  bootstrap:    [ AppComponent ],
})

export class AppModule { }