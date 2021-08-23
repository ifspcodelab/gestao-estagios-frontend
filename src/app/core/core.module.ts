import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from "../shared/shared.module";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RouterModule } from "@angular/router";
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { CardComponent } from './components/card/card.component';
import { ContentComponent } from './components/content/content.component';
import { ContentToolbarComponent } from './components/content/content-toolbar/content-toolbar.component';
import { ContentMainComponent } from './components/content/content-main/content-main.component';
import { ContentCardsComponent } from './components/content/content-cards/content-cards.component';
import { ContentDetailComponent } from './components/content/content-detail/content-detail.component';
import { ContentFormComponent } from './components/content/content-form/content-form.component';
import { ContentDetailSectionComponent } from './components/content/content-detail/content-detail-section/content-detail-section.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ToolbarComponent,
    SidebarComponent,
    EmptyStateComponent,
    CardComponent,
    ContentComponent,
    ContentToolbarComponent,
    ContentMainComponent,
    ContentCardsComponent,
    ContentDetailComponent,
    ContentDetailSectionComponent,
    ContentFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ConfirmDialogComponent,
    ToolbarComponent,
    SidebarComponent,
    CardComponent,
    EmptyStateComponent,
    ContentComponent,
    ContentMainComponent,
    ContentToolbarComponent,
    ContentCardsComponent,
    ContentDetailComponent,
    ContentDetailSectionComponent,
    ContentFormComponent,
    ReactiveFormsModule
  ]
})
export class CoreModule { }
