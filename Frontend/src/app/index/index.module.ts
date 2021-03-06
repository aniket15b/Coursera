import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { GetvaluePipe } from '../getvalue.pipe';
import { PipesModule } from '../getvalue.pipe.module';

import { IonicModule } from '@ionic/angular';

import { IndexPage } from './index.page';

const routes: Routes = [
  {
    path: '',
    component: IndexPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [IndexPage],
  providers: [GetvaluePipe]
})
export class IndexPageModule {}
