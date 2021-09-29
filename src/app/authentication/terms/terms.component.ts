import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  closeDialog() {
    this.dialog.closeAll();
  }

  ngOnInit(): void {
  }

}
