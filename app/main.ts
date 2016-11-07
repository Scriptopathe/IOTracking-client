import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

//        $.material.init()
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);