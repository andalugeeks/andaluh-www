import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranscriptorComponent } from './transcriptor.component';

const transcriptorRoutes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: TranscriptorComponent
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(transcriptorRoutes) ],
  exports: [ RouterModule ]
})

export class TranscriptorRouting { }
