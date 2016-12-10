import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent }  from './components/app.component';
import { TestComponent }    from './components/test.component';
import { UserPanelComponent } from './components/userpanel.component';
import { DashboardComponent } from './components/dashboard.component';
import { RegatasComponent } from './components/regatas.component';
import { DeviceListComponent } from './components/devices-list.component';
import { DeviceDashboardComponent } from './components/devices-dashboard.component';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'regatas', component: RegatasComponent },
  { path: 'devices', component: DeviceDashboardComponent },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}