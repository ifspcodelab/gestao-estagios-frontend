import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { FilterDialogComponent } from '../../../filter-dialog/filter-dialog.component';
import { EntityStatus } from "../../../../models/enums/status";

@Component({
  selector: 'app-content-detail-section',
  templateUrl: './content-detail-section.component.html',
  styleUrls: ['./content-detail-section.component.scss']
})
export class ContentDetailSectionComponent implements OnInit {
  @Input() icon: string | undefined;
  @Input() title: string | undefined;
  @Input() parentEntityStatus: EntityStatus | undefined;
  @Output() openDialogEvent = new EventEmitter<void>();
  @Output() openFilterEvent = new EventEmitter<number>();
  selectedFilter: number = 1;
  filterNames: string[] = ['Todos', 'Habilitados', 'Desabilitados'];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.openDialogEvent.emit();
  }

  private getDialogConfig() {
    return {
      autoFocus: true,
      data: {
        filterNames: this.filterNames,
        onChange: ($event: MatRadioChange) => {
          this.selectedFilter = $event.value;
        },
        handleFilter: () => {
          this.openFilterEvent.emit(this.selectedFilter)
          this.dialog.closeAll();
        },
        selected: this.selectedFilter
      }
    };
  }

  openFilterDialog() {
    this.dialog.open(FilterDialogComponent, this.getDialogConfig()).afterClosed()
  }

  disableAddButton() {
    return this.parentEntityStatus === EntityStatus.DISABLED;
  }
}
