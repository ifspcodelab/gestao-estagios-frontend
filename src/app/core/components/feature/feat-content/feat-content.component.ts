import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feat-content',
  templateUrl: './feat-content.component.html',
  styleUrls: ['./feat-content.component.scss']
})
export class FeatContentComponent {
  @Input() emptyState: boolean = false;
  @Input() loading: boolean = false;
}
