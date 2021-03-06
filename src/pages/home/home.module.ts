/**
 * Created by hkb on 29.06.17.
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { AudioItemComponentModule } from "../../shared/components/audio-item/audio-item.module";
import { HeaderComponentModule } from "../../shared/components/header/header.module";


@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    AudioItemComponentModule,
    HeaderComponentModule,
  ],
  providers: [
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}
