import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { onChange: Function, handleFilter: Function, selected: number }) { }

  ngOnInit(): void {
  }
}
