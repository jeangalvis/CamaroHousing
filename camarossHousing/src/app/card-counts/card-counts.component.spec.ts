import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCountsComponent } from './card-counts.component';

describe('CardCountsComponent', () => {
  let component: CardCountsComponent;
  let fixture: ComponentFixture<CardCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
