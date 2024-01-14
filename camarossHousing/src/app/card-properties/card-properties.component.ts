import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-properties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-properties.component.html',
  styleUrl: './card-properties.component.css',
})
export class CardPropertiesComponent {
  @Input() cardPrice: number = 0;
  @Input() cardBano: number = 0;
  @Input() cardMetros: string = '';
  @Input() cardEstrato: number = 0;
  @Input() CardIdProperties: string = '';
  @Input() cardUrl: string = '';
  @Input() cardPais: string = '';
  @Input() cardCiudad: string = '';

  private _router = inject(Router);

  navegate(id: string): void {
    this._router.navigate(['/properties', id]);
  }
}
