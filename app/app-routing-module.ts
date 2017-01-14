import { NgModule }                   from '@angular/core';
import { Routes, RouterModule }       from '@angular/router';
import { AppComponent }               from './components/app.component';
import { TestComponent }              from './components/test.component';
import { UserPanelComponent }         from './components/userpanel.component';
import { DashboardComponent }         from './components/dashboard/dashboard.component';
import { RegatasComponent }           from './components/dashboard/regatas/regatas.component';
import { RegataExplorerComponent }    from './components/explorer/regata-explorer.component';
import { DeviceListComponent }        from './components/dashboard/devices/devices-list.component';
import { DeviceDashboardComponent }   from './components/dashboard/devices/devices-dashboard.component';
import { RegataEditionComponent }     from './components/dashboard/regatas/regata.edit.component';
import { RaceComponent }              from './components/dashboard/regatas/race.component';
import { RacerComponent }             from './components/dashboard/regatas/racer.component';    
import { RegataFullViewComponent }    from './components/explorer/regata-fullview.component';
import { RaceViewComponent }          from './components/race-view.component';
import { RacemapsComponent }          from './components/dashboard/racemaps/racemaps.component';

const appRoutes: Routes = [
  { path: 'regata-explorer', component: RegataExplorerComponent },
  { path: 'regata-explorer/regata',
    children: [
    {
      path: ':regata',
      component: RegataFullViewComponent
    },
    {
      path: ':regata/:race',
      component: RaceViewComponent
    }
  ]},

  // DASHBOARD
  { 
    path: 'dashboard', 
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'racemaps',
        component: RacemapsComponent
      },
      {
        // dashboard/devices/
        path: 'devices',
        component: DeviceDashboardComponent
      },
      {
        // dashboard/regatas/
        path: 'regatas',
        children: [
          {
            path: '',
            component: RegatasComponent
          },
          {
            // dashboard/regatas/:regata
            path: ':regata',
            children: [
              {
                // dashboard/regatas/:regata/edit
                path: '',
                component: RegataEditionComponent
              },
              {
                path: 'newrace',
                component: RaceComponent
              },
              {
                // dashboard/regatas/:regata/races
                path: 'races/:race',
                children: [
                  {
                    path: 'edit',
                    children: [
                      {
                        path: '',
                        component: RaceComponent
                      },
                      {
                        path: 'newracer',
                        component: RacerComponent
                      },
                      {
                        path: ':racer/edit',
                        component: RacerComponent
                      }
                    ]
                  },
                  {
                    path: 'view',
                    component: RaceViewComponent,
                  }    
                ]
              },
            ]
          },
        ]
      }
    ]
  },

  { path: '**', component: RegataExplorerComponent }
];

/*

  { path: 'regata-explorer', component: RegataExplorerComponent },
  { path: 'regata-explorer/regata/:regataId', component: RegataFullViewComponent },
  { path: 'regata-explorer/regata/:regata/:race', component: RaceViewComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/regatas', component: RegatasComponent },
  { path: 'dashboard/devices', component: DeviceDashboardComponent },
  { path: 'dashboard/regatas/:regataId', component: RegataEditionComponent },
  { path: 'dashboard/regatas/:regataId/:indexRace', component: RaceEditionComponent },
  { path: 'dashboard/regatas/newrace/:regataId', component: NewRaceComponent },
  { path: 'dashboard/race/view/:regata/:race', component: RaceViewComponent },

  { path: '**', component: RegataExplorerComponent }
  */

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}