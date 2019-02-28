import { NgModule } from '@angular/core';
import { CommonModule as NGCommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterComponent } from './footer/footer.component';

const components = [
  NavMenuComponent,
  FooterComponent
];

@NgModule({
  imports: [
    NGCommonModule,
    HttpModule,
    TranslateModule
  ],
  declarations: components,
  providers: [ ],
  exports : [...components]
})
export class CommonModule { }
