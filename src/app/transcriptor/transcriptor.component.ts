/**
 * Copyleft (c) 2018-2019 Andalugeeks
 * 
 * Authors:
 * - Eduardo Amador <eamadorpaton@gmail.com>
 */

import { Subject } from 'rxjs';
import { debounceTime, windowWhen } from 'rxjs/operators';
import { Component, ViewChild, HostBinding, OnInit, OnDestroy, Input } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import EPA from '@andalugeeks/andaluh';
import { NavigatorExtended } from '../types/navigation.type';

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
  showShareModal: boolean = false;
  vaf: string = 'ç';
  vvf: string;
  transcriptionType = environment.transcriptionType;
  from_options = [
    { label: 'ES', id: 'es' }
  ];
  to_options = [
    { label: 'AND', id: 'and' }
  ];
  from: any;
  to: any;

  casPlaceholder = environment.casPlaceholder;
  andPlaceholder = environment.andPlaceholder;
  casFromUrl: string = this._getParam("text");
  transcriptedValue: string = '';
  value: string = '';
  shareUrl: string = '';
  animated: string = '';
  share_text: object = {
    copy: 'TRANSCRIPT.SHARE.COPY',
    social: 'TRANSCRIPT.SHARE.SOCIAL',
    share: 'TRANSCRIPT.SHARE.SHARE',
    copied: 'TRANSCRIPT.SHARE.COPIED',
  };

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
    window.addEventListener('click', this.closeModal.bind(this));
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

  copy() {
    this._getShortURL().then((shortURL) => {
      (navigator as NavigatorExtended).clipboard.writeText(shortURL).then(() => {
        this.animated = 'animated'
        setTimeout(() => this.animated = '', 3000);
      });
    }).catch(e => console.error(e));
  }

  share() {
    this._getShortURL().
      then((shortURL) => {
        this.shareUrl = shortURL;
        this.showShareModal = true;
      }).catch(e => console.error(e));
  }

  shareURL(url) {
    window.open(url, '_blank');
    this.showShareModal = false;
  }

  shareFacebook() {
    this.shareURL(`https://www.facebook.com/sharer.php?u=${this.shareUrl}`);
  }

  shareTwitter() {
    this.shareURL(`https://twitter.com/intent/tweet?text=${this.shareUrl}`);
  }

  shareTelegram() {
    this.shareURL(`https://telegram.me/share?url=${this.shareUrl}`);
  }

  shareWhatsapp() {
    this.shareURL(`whatsapp://send?text=${this.shareUrl}`);
  }

  closeModal(evt) {
    if (evt.target.id === 'modal-wrapper') {
      this.showShareModal = false;
      this.shareUrl = '';
    }
  }

  copyToClipboard(event) {
    event.target.select();
    document.execCommand("copy");
  }

  onKeyUp(casText: string) {
    this.value = casText;
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

  private _getShortURL(): Promise<string> {
    const URL_API = 'https://s.andaluh.es/yourls-api.php?signature=d387956c6c&action=shorturl&url=';
    const URL = 'https://andaluh.es/transcriptor/#' + `?text=${this.value}`;
    return new Promise((resolve, reject) => {
      this.http.get(`${URL_API}${encodeURIComponent(URL)}`).subscribe((response) => {
        const text = response.text();
        const xml = (new DOMParser()).parseFromString(text, 'text/xml');
        const urlElement = xml.querySelector('shorturl');
        if (urlElement) {
          resolve(urlElement.textContent);
        }
        reject('Error: Short URL was not created.')
      });
    });
  }

  // NOTE: this could come from a JSON file where all tthe options will be defined
  private _setDefaultOptions() {
    this.from = { label: 'ES', id: 'es' };
    this.to = { label: 'AND', id: 'and' };
  }

  private _getParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
      return "";
    else
      return results[1];
  }

  ngOnDestroy() {
    window.removeEventListener('click', this.closeModal);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
