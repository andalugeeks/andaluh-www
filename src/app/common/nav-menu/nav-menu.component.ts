import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, OnDestroy {

  isActive: boolean = false;
  currentLang = 'and';

  constructor(private translate: TranslateService) {
    
  }

  ngOnInit() { }

  ngOnDestroy() { }

  langTo(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  toggleNav() {
    this.isActive = !this.isActive;
  }

}
