/**
 * Copyleft (c) 2018-2019 Andalugeeks
 * 
 * Authors:
 * - Eduardo Amador <eamadorpaton@gmail.com>
 */

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Component, ViewChild, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import EPA from '@andalugeeks/andaluh';

@Component({
  selector: 'app-transcriptor',
  templateUrl: './transcriptor.component.html',
  styleUrls: ['./transcriptor.component.scss'],
})
export class TranscriptorComponent implements OnInit, OnDestroy {
  
  @ViewChild('textCasElement') textCasElement;
  @HostBinding('class.columns') grid: boolean = true;

  private epa: EPA;
  private subscription: Subject<string> = new Subject();
  
  showVafDrop: boolean = false;
  vaf: string = 'ç';
  vvf: string;
  transcriptionType = environment.transcriptionType;
  from_options = [
    {label: 'ES', id: 'es'}
  ];
  to_options = [
    {label: 'AND', id: 'and'}
  ];
  from: any;
  to: any;
  
  casPlaceholder = environment.casPlaceholder;
  andPlaceholder = environment.andPlaceholder;
  casFromUrl: string = this._getParam("text");
  transcriptedValue: string = '';

  constructor(private http: Http) {
    this._setDefaultOptions();
  }

  ngOnInit() {
    if (this.transcriptionType === 'local') {
      this.epa = new EPA();
      this.localSubcription();
    } else {
      this.apiSubcription();
    }

    if (this.textCasElement) {
      this.textCasElement.nativeElement.onfocus = () => {
        this.casPlaceholder = '';
        this.andPlaceholder = '';
      };
    }
  }

  localSubcription() {
    if (this.casFromUrl) {
      // setTimeout(() => {
        this._setFromUrl();
        this.transcriptedValue = this.epa.transcript(this.casFromUrl, this.vaf, this.vvf);
      // }, 0);
    }
    
    this.subscription.pipe(
      debounceTime(0)
    ).subscribe(casText => {
      if (casText !== '') {
        this.transcriptedValue = this.epa.transcript(casText, this.vaf, this.vvf);
      } else {
        this.transcriptedValue = '';
      }
    });
  }

  apiSubcription() {
    if (this.casFromUrl) {
      // setTimeout(() => {
        this._setFromUrl();
        this.transcript(this.casFromUrl).subscribe((response) => {
          const result = response.json();
          this.transcriptedValue = decodeURI(result[Object.keys(result)[0]]);
        });
      // }, 750);
    }

    this.subscription.pipe(
      debounceTime(500)
    ).subscribe(casText => {
      if (casText !== '') {
        this.transcript(casText).subscribe((response) => {
          const result = response.json();
          this.transcriptedValue = result[Object.keys(result)[0]];
        });
      } else {
        this.transcriptedValue = '';
      }
    });
  }
  
  changeVaf(value) {
    this.vaf = value;
    this.subscription.next(this.textCasElement.nativeElement.value);
    this.showVafDrop = false;
  }

  toggleVVF() {
    if (this.vvf === undefined) {
      this.vvf = 'j';
    } else {
      this.vvf = undefined;
    }
    this.subscription.next(this.textCasElement.nativeElement.value);
  }

  resetVafAndVvf() {
    this.vaf = 'ç';
    this.vvf = undefined;
    this.subscription.next(this.textCasElement.nativeElement.value);
  }

  dropdownToggle() {
    this.showVafDrop = !this.showVafDrop;
  }
  
  copyToClipboard(event) {
    event.target.select();
    document.execCommand("copy");
  }

  onKeyUp(casText: string) {
    this.subscription.next(casText);
  }

  transcript(casText: string) {
    return this.http.get(`${environment.transcriptionAPI}?texto=${encodeURI(casText)}`);
  }

  private _setFromUrl() {
    if (this.textCasElement) {
      this.textCasElement.nativeElement.value = decodeURI(this.casFromUrl);
    }
  }

  // NOTE: this could come from a JSON file where all tthe options will be defined
  private _setDefaultOptions() {
    this.from = {label: 'ES', id: 'es'};
    this.to = {label: 'AND', id: 'and'};
  }

  private _getParam(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return "";
    else
      return results[1];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
