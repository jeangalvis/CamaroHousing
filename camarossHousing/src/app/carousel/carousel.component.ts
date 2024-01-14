import { Component, Input, inject } from '@angular/core';
import { IImagen } from '../models/imagen.model';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent {
  @Input() CardIdProperties: string = '';

  imageUrls: string[] = [];
  private _apiService = inject(ApiService);
  ngOnInit() {
    this.getUrl(this.CardIdProperties);
  }
  getUrl(id: string): void {
    this._apiService.getImage(id).subscribe({
      next: (data: IImagen[] | IImagen) => {
        if (Array.isArray(data)) {
          this.imageUrls = data.map((imagen) => imagen.datosImagen);
        } else {
          this.imageUrls.push(data.datosImagen);
        }
      },
      error: (error) => {
        console.error('Error al obtener las imágenes', error);
      },
    });
  }
}
