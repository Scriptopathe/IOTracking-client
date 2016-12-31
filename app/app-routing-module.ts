import { NgModule }                   from '@angular/core';
import { Routes, RouterModule }       from '@angular/router';
import { AppComponent }               from './components/app.component';
import { TestComponent }              from './components/test.component';
import { UserPanelComponent }         from './components/userpanel.component';
import { DashboardComponent }         from './components/dashboard.component';
import { RegatasComponent }           from './components/regatas.component';
import { DeviceListComponent }        from './components/devices-list.component';
import { DeviceDashboardComponent }   from './components/devices-dashboard.component';
import { RegataEditionComponent }     from './components/regata.edit.component';
import { RaceEditionComponent }       from './components/race.edit.component';
import { NewRaceComponent }           from './components/new-race.component';
import { RaceViewComponent }           from './components/race-view.component';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'regatas', component: RegatasComponent },
  { path: 'devices', component: DeviceDashboardComponent },
  { path: 'regata-edit/:regataId', component: RegataEditionComponent },
  { path: 'race-edit/:regataId/:indexRace', component: RaceEditionComponent },
  { path: 'new-race/:regataId', component: NewRaceComponent },
  { path: 'view-race/:regata/:race', component: RaceViewComponent },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}