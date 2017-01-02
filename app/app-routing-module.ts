import { NgModule }                   from '@angular/core';
import { Routes, RouterModule }       from '@angular/router';
import { AppComponent }               from './components/app.component';
import { TestComponent }              from './components/test.component';
import { UserPanelComponent }         from './components/userpanel.component';
import { DashboardComponent }         from './components/dashboard.component';
import { RegatasComponent }           from './components/regatas.component';
import { RegataExplorerComponent }    from './components/regata-explorer.component';
import { DeviceListComponent }        from './components/devices-list.component';
import { DeviceDashboardComponent }   from './components/devices-dashboard.component';
import { RegataEditionComponent }     from './components/regata.edit.component';
import { RegataFullViewComponent }    from './components/regata-fullview.component';
import { RaceEditionComponent }       from './components/race.edit.component';
import { NewRaceComponent }           from './components/new-race.component';
import { RaceViewComponent }          from './components/race-view.component';

const appRoutes: Routes = [
  { path: 'regata-explorer',                            component: RegataExplorerComponent },
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
                // dashboard/regatas/:regata/races
                path: 'races/:race',
                children: [
                  {
                    path: 'edit',
                    component: RaceEditionComponent
                  },
                  {
                    path: 'view',
                    component: RaceViewComponent,
                  },
                  {
                    path: 'new',
                    component: NewRaceComponent
                  }
                ]
              }
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