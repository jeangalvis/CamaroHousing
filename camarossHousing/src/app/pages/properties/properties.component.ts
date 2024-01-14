import { Component, OnInit, inject } from '@angular/core';
import { CardPropertiesComponent } from '../../card-properties/card-properties.component';
import { IProperties } from '../../models/properties.model';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { FormFilterComponent } from '../../form-filter/form-filter.component';
import { ISelect } from '../../models/select.model';

@Component({
  selector: 'app-properties',
  standalone: true,
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css',
  imports: [
    CardPropertiesComponent,
    CommonModule,
    PaginationComponent,
    FormFilterComponent,
  ],
})
export class PropertiesComponent implements OnInit {
  properties: IProperties | any;
  search: string = '';
  selectedOfferts: string = '';
  selectedDomains: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;


  private _apiService = inject(ApiService);
  ngOnInit(): void {
    this._apiService.updateSearchString.subscribe((term) => {
      this.search = term;
      this.getProperties();
    });
  }

  onPageChange(page: number): void {
    this.getProperties(page);
  }
  onSearch(eventData: {
    searchQuery: string;
    selectedOfferts: string;
    selectedDomains: string;
    minPrice: number | null;
    maxPrice: number | null;
  }): void {
    this.search = eventData.searchQuery;
    this.selectedOfferts = eventData.selectedOfferts;
    this.selectedDomains = eventData.selectedDomains;
    this.minPrice = eventData.minPrice;
    this.maxPrice = eventData.maxPrice;
    this._apiService.updateSearchTerm(eventData.searchQuery);
    this.getProperties();
  }
  private getProperties(page?: number): void {
    this._apiService
      .getProperties(
        12,
        page || 1,
        this.search,
        this.minPrice,
        this.maxPrice,
        this.selectedOfferts,
        this.selectedDomains
      )
      .subscribe((data: IProperties) => {
        this.properties = data;
      });
  }

}
