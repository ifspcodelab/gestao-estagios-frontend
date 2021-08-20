import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from "../shared/shared.module";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RouterModule } from "@angular/router";
import { FeatureComponent } from './components/feature/feature.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { CardComponent } from './components/card/card.component';
import { FeatHeaderComponent } from './components/feature/feat-header/feat-header.component';
import { FeatContentComponent } from './components/feature/feat-content/feat-content.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ToolbarComponent,
    SidebarComponent,
    FeatureComponent,
    EmptyStateComponent,
    CardComponent,
    FeatHeaderComponent,
    FeatContentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    ConfirmDialogComponent,
    ToolbarComponent,
    SidebarComponent,
    FeatureComponent,
    CardComponent,
    FeatHeaderComponent,
    FeatContentComponent
  ]
})
export class CoreModule { }
