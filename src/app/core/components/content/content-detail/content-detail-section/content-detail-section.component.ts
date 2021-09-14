import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { FilterDialogComponent } from '../../../filter-dialog/filter-dialog.component';

@Component({
  selector: 'app-content-detail-section',
  templateUrl: './content-detail-section.component.html',
  styleUrls: ['./content-detail-section.component.scss']
})
export class ContentDetailSectionComponent implements OnInit {
  @Input() emptyState: boolean = false;
  @Input() icon: string | undefined;
  @Input() title: string | undefined;
  @Output() openDialogEvent = new EventEmitter<void>();
  @Output() openFilterEvent = new EventEmitter<number>();
  selectedFilter: number = 1;

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
        onChange: ($event: MatRadioChange) => {
          if ($event.value == 1) {
            this.selectedFilter = 1;
          }
          if ($event.value == 2) {
            this.selectedFilter = 2;
          }
          if ($event.value == 3) {
            this.selectedFilter = 3;
          } 
        },
        handleFilter: () => {
          if (this.selectedFilter == 1) {
            this.openFilterEvent.emit(1);
          }
          if (this.selectedFilter == 2 ) {
            this.openFilterEvent.emit(2);
          }
          if (this.selectedFilter == 3) {
            this.openFilterEvent.emit(3);
          }
          this.dialog.closeAll();
        },
        selected: this.selectedFilter
      }
    };
  }

  openFilterDialog() {
    this.dialog.open(FilterDialogComponent, this.getDialogConfig()).afterClosed()
  }

  selectOption() {
    this.openFilterEvent.emit(1);
  }
}
