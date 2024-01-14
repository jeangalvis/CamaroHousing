import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { IProperties, Register } from '../../models/properties.model';
import { CarouselComponent } from "../../carousel/carousel.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-properties-detail',
    standalone: true,
    templateUrl: './properties-detail.component.html',
    styleUrl: './properties-detail.component.css',
    imports: [CarouselComponent, CommonModule]
})
export class PropertiesDetailComponent implements OnInit {
  loading: boolean = true;
  public properties?: Register;

  private _route = inject(ActivatedRoute);
  private _apiService = inject(ApiService);

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this._apiService
        .getPropertieId(params['id'])
        .subscribe((data: Register) => {
          this.properties = data;
          this.loading = false;
        });
    });
  }
}
