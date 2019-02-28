import { NgModule } from '@angular/core';
import { CommonModule as NgCommon } from '@angular/common';
import { CommonModule } from '../common/common.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranscriptorRouting } from './transcriptor.routing';
import { TranscriptorComponent } from './transcriptor.component';

@NgModule({
  imports: [
    NgCommon,
    CommonModule,
    TranslateModule,
    TranscriptorRouting
  ],
  declarations: [
    TranscriptorComponent
  ]
})
export class TranscriptorModule { }
