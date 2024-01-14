import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ISelect } from '../models/select.model';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-form-filter',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, NgxMaskPipe, ReactiveFormsModule],
  templateUrl: './form-filter.component.html',
  styleUrl: './form-filter.component.css',
})
export class FormFilterComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<{
    searchQuery: string;
    selectedOfferts: string;
    selectedDomains: string;
    minPrice: number;
    maxPrice: number;
  }>();
  offerts: ISelect[] = [];
  domains: ISelect[] = [];
  searchQuery: string = '';
  selectedOfferts: string = '';
  selectedDomains: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  mask = 'separator';

  private _apiService = inject(ApiService);

  ngOnInit(): void {
    this._apiService.updateSearchString.subscribe((term) => {
      this.searchQuery = term;
    });
    this._apiService.getOfferts().subscribe((data: ISelect[]) => {
      this.offerts = data;
    });
    this._apiService.getDomains().subscribe((data: ISelect[]) => {
      this.domains = data;
    });
  }

  onSearch(): void {
    this.searchEvent.emit({
      searchQuery: this.searchQuery,
      selectedOfferts: this.selectedOfferts,
      selectedDomains: this.selectedDomains,
      minPrice: this.minPrice || 0,
      maxPrice: this.maxPrice || Number.MAX_SAFE_INTEGER,
    });
  }
  onPriceChange(): void {
    this.searchEvent.emit({
      searchQuery: this.searchQuery,
      selectedOfferts: this.selectedOfferts,
      selectedDomains: this.selectedDomains,
      minPrice: this.minPrice || 0,
      maxPrice: this.maxPrice || Number.MAX_SAFE_INTEGER,
    });
  }

}
