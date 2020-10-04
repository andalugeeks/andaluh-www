import { NgModule } from '@angular/core';
import { CommonModule as NGCommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterComponent } from './footer/footer.component';
import { DecodePipe } from '../pipes/decode.pipe';

const components = [
  NavMenuComponent,
  FooterComponent,
  DecodePipe,
];

@NgModule({
  imports: [
    TranslateModule,
    NGCommonModule,
    HttpModule,
  ],
  declarations: components,
  providers: [],
  exports: [...components]
})
export class CommonModule { }
