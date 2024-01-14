import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-counts',
  standalone: true,
  imports: [],
  templateUrl: './card-counts.component.html',
  styleUrl: './card-counts.component.css',
})
export class CardCountsComponent {
  @Input() cardSubtitle: string = '';
  @Input() cardIcon: string = '';
  @Input() cardOffert: string = '';
  @Input() cardEnlace: string = '';
}
