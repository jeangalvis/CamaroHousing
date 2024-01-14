import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CardCountsComponent } from '../../card-counts/card-counts.component';
import { ICounts } from '../../models/count.model';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CardCountsComponent, FormsModule],
})
export class HomeComponent implements OnInit {
  counts: ICounts | undefined;
  searchTerm: string = '';

  private _apiService = inject(ApiService);
  private _router = inject(Router);
  ngOnInit(): void {
    this._apiService.getCount().subscribe((data: ICounts) => {
      this.counts = data;
    });
  }
  onSubmit(): void {
    if (this.searchTerm.trim() !== '') {
      this._apiService.updateSearchTerm(this.searchTerm);
      this._router.navigate(['/properties']);
    }
  }
}
