import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() hasPreviusPage: boolean = false;
  @Input() hasNextPage: boolean = false;
  @Input() pageIndex: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];

    // Agrega la página actual
    visiblePages.push(this.pageIndex);

    // Agrega páginas anteriores
    for (
      let i = this.pageIndex - 1;
      i >= Math.max(1, this.pageIndex - 2);
      i--
    ) {
      visiblePages.unshift(i);
    }

    // Agrega páginas posteriores
    for (
      let i = this.pageIndex + 1;
      i <= Math.min(this.totalPages, this.pageIndex + 2);
      i++
    ) {
      visiblePages.push(i);
    }

    return visiblePages;
  }
  hasMorePagesBefore(): boolean {
    return this.pageIndex > 3;
  }
  hasMorePagesAfter(): boolean {
    return this.totalPages > this.pageIndex + 2;
  }

  navigateToPage(page: number): void {
    this.pageChange.emit(page);
  }
  getPreviusPageClasses(): string {
    return this.hasPreviusPage ? '' : 'disabled';
  }

  getNextPageClasses(): string {
    return this.hasNextPage ? '' : 'disabled';
  }
}
